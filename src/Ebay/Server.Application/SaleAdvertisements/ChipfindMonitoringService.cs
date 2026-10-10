using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Domain;

namespace Server.Application.SaleAdvertisements;

/// <summary>
/// Сценарий мониторинга объявлений о продаже на chipfind.ru: сопоставляет свежие объявления с товарами,
/// ведёт историю отправки писем и уведомляет о новых интересных объявлениях.
/// </summary>
public class ChipfindMonitoringService
{
    private const int DelayAfterEmailMilliseconds = 5000;

    private readonly ILogger<ChipfindMonitoringService> _logger;
    private readonly IProductEmailSendHistoryRepository _productEmailSendHistoryRepository;
    private readonly IProductEmailSendHistoryQueries _productEmailSendHistoryQueries;
    private readonly IWriteModelUnitOfWork _unitOfWork;
    private readonly IChipfindAdapter _chipfindAdapter;
    private readonly IEmailSender _emailSender;
    private readonly ProductService _productService;

    /// <summary>
    /// Создает сервис мониторинга объявлений о продаже на chipfind.ru.
    /// </summary>
    public ChipfindMonitoringService(
        ILogger<ChipfindMonitoringService> logger,
        IProductEmailSendHistoryRepository productEmailSendHistoryRepository,
        IProductEmailSendHistoryQueries productEmailSendHistoryQueries,
        IWriteModelUnitOfWork unitOfWork,
        IChipfindAdapter chipfindAdapter,
        IEmailSender emailSender,
        ProductService productService)
    {
        _logger = logger;
        _productEmailSendHistoryRepository = productEmailSendHistoryRepository;
        _productEmailSendHistoryQueries = productEmailSendHistoryQueries;
        _unitOfWork = unitOfWork;
        _chipfindAdapter = chipfindAdapter;
        _emailSender = emailSender;
        _productService = productService;
    }

    private sealed record ProductInner(Guid ProductId, Regex Regex, bool IsInteresting);

    /// <summary>
    /// Обрабатывает свежие объявления о продаже и отправляет письма о новых интересных объявлениях.
    /// </summary>
    /// <param name="targetEmail">Адрес, на который отправляются уведомления.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    public async Task ProcessRecentAdvertisementsAsync(string targetEmail, CancellationToken cancellationToken)
    {
        var products = await GetProducts(cancellationToken);

        var recentAdvertisements = await _chipfindAdapter.GetRecentSaleAdvertisements(cancellationToken);

        foreach (var saleAdvertisement in recentAdvertisements)
        {
            await ProcessAdvertisement(
                targetEmail: targetEmail,
                saleAdvertisement: saleAdvertisement,
                products: products,
                cancellationToken: cancellationToken);
        }
    }

    private async Task ProcessAdvertisement(
        string targetEmail,
        SaleAdvertisement saleAdvertisement,
        IReadOnlyCollection<ProductInner> products,
        CancellationToken cancellationToken)
    {
        var newInterestingAds = new HashSet<(bool IsAmbiguous, string Ad, string? Contact)>();
        // Кеш агрегатов, уже загруженных или созданных в рамках обработки этого объявления -
        // один продавец может встретиться в нескольких items объявления, а запись ещё не сохранена в БД.
        var historyByProductId = new Dictionary<Guid, ProductEmailSendHistory>();
        string? advertisementContact = null;

        foreach (var saleAdvertisementItem in saleAdvertisement.Items)
        {
            var matchesWithProducts = products
                .Where(x => x.Regex.IsMatch(saleAdvertisementItem))
                .ToList();

            if (matchesWithProducts.Count == 0)
            {
                continue;
            }

            advertisementContact = await _chipfindAdapter.TryGetAdvertisementContactAsync(
                saleAdvertisement,
                cancellationToken);

            var isAmbiguous = matchesWithProducts.Count > 1;

            foreach (var product in matchesWithProducts)
            {
                if (!historyByProductId.TryGetValue(product.ProductId, out var record))
                {
                    var existingId = await _productEmailSendHistoryQueries.FindIdAsync(
                        productId: product.ProductId,
                        seller: saleAdvertisement.Seller,
                        marketplace: WellKnown.ChipFind.Marketplace,
                        cancellationToken: cancellationToken);

                    record = existingId is null
                        ? null
                        : await _productEmailSendHistoryRepository.GetByIdAsync(existingId.Value, cancellationToken);
                }

                if (record is null)
                {
                    var newRecord = ProductEmailSendHistory.Create(
                        productId: product.ProductId,
                        seller: saleAdvertisement.Seller,
                        link: saleAdvertisement.Link.ToString(),
                        marketplace: WellKnown.ChipFind.Marketplace,
                        isAmbiguous: isAmbiguous,
                        advertisementDate: saleAdvertisement.Date,
                        contact: string.IsNullOrWhiteSpace(advertisementContact) ? null : advertisementContact);

                    await _productEmailSendHistoryRepository.AddAsync(newRecord, cancellationToken);
                    historyByProductId[product.ProductId] = newRecord;

                    if (product.IsInteresting)
                    {
                        newInterestingAds.Add((IsAmbiguous: isAmbiguous, Ad: saleAdvertisementItem, Contact: advertisementContact));
                    }
                }
                else
                {
                    record.UpdateForNewAdvertisement(
                        link: saleAdvertisement.Link.ToString(),
                        advertisementDate: saleAdvertisement.Date,
                        isAmbiguous: isAmbiguous,
                        contact: advertisementContact);
                    historyByProductId[product.ProductId] = record;
                }
            }
        }

        // Deferred commit: if the email send below fails, the history rows written by SaveChangesAsync
        // must not persist, or the retry on the next run will see them as "already notified" via
        // FindIdAsync and silently drop the notification for good.
        await using var transaction = await _unitOfWork.BeginTransactionAsync(cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        if (newInterestingAds.Count > 0)
        {
            var newItems = string.Join(" ",
                values: newInterestingAds.Select(x =>
                    x.Ad + (x.IsAmbiguous ? " [Нашлось несколько товаров] " : "")
                    ).Select(x => $"<div>{x}</div>")
                );
            var emailBody = $"<a href=\"{saleAdvertisement.Link}\">ссылка</a><br><br>{newItems}<br><div>{advertisementContact}</div>";
            var emailTopic = $"{saleAdvertisement.Title} [{saleAdvertisement.Seller}]";
            _logger.LogInformation("Email sent {EmailTopic}", emailTopic);
            _logger.LogDebug("Email sent {EmailBody}", emailBody);
            await _emailSender.Send(
                targetAddress: targetEmail,
                topic: emailTopic,
                messageText: emailBody);

            await Task.Delay(millisecondsDelay: DelayAfterEmailMilliseconds, cancellationToken: cancellationToken);
        }

        await transaction.CommitAsync(cancellationToken);
    }

    private async Task<IReadOnlyCollection<ProductInner>> GetProducts(CancellationToken cancellationToken)
    {
        var products = await _productService.GetAllProductsAsync(cancellationToken);

        return products.Select(static x => new ProductInner(
                ProductId: x.Data.Id,
                Regex: x.ProductRegex,
                IsInteresting: x.IsInteresting))
            .ToArray();
    }
}
