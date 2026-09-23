using System.Text.RegularExpressions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.New.Infrastructure;
using Server.Domain;

namespace Server.Application.New.HostedServices.ChipFind;

public class ChipfindBackgroundTask : BackgroundTask
{
    private readonly ILogger<ChipfindBackgroundTask> _logger;
    private readonly EbayServerOptions _ebayServerOptions;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private const int DelayMilliseconds = 5000;

    public ChipfindBackgroundTask(
        ILogger<ChipfindBackgroundTask> logger,
        EbayServerOptions ebayServerOptions,
        IServiceScopeFactory serviceScopeFactory)
        : base(logger)
    {
        _logger = logger;
        _ebayServerOptions = ebayServerOptions;
        _serviceScopeFactory = serviceScopeFactory;
    }

    public override TimeSpan UpdateTime => WellKnown.ChipFind.UpdateTime;
    public override TimeSpan ErrorDelay => WellKnown.ChipFind.ErrorDelay;

    private record ProductInner(Guid ProductId, Regex Regex, bool IsInteresting);

    protected override async Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        if (_ebayServerOptions.IsLocalRun)
        {
            return;
        }

        using var scope = _serviceScopeFactory.CreateScope();
        var productEmailSendHistoryRepository = scope.ServiceProvider.GetRequiredService<IProductEmailSendHistoryRepository>();
        var productEmailSendHistoryQueries = scope.ServiceProvider.GetRequiredService<IProductEmailSendHistoryQueries>();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IWriteModelUnitOfWork>();
        var chipfindAdapter = scope.ServiceProvider.GetRequiredService<IChipfindAdapter>();
        var emailSender = scope.ServiceProvider.GetRequiredService<IEmailSender>();
        var productService = scope.ServiceProvider.GetRequiredService<ProductService>();

        var products = await GetProducts(cancellationToken: cancellationToken, productService: productService);

        var recentAdvertisements = await chipfindAdapter.GetRecentSaleAdvertisements(cancellationToken);

        foreach (var saleAdvertisement in recentAdvertisements)
        {
            await ProcessAdvertisement(
                emailSender: emailSender,
                chipfindAdapter: chipfindAdapter,
                cancellationToken: cancellationToken,
                saleAdvertisement: saleAdvertisement,
                products: products,
                productEmailSendHistoryRepository: productEmailSendHistoryRepository,
                productEmailSendHistoryQueries: productEmailSendHistoryQueries,
                unitOfWork: unitOfWork);
        }
    }

    private async Task ProcessAdvertisement(
        IEmailSender emailSender,
        IChipfindAdapter chipfindAdapter,
        SaleAdvertisement saleAdvertisement,
        IReadOnlyCollection<ProductInner> products,
        IProductEmailSendHistoryRepository productEmailSendHistoryRepository,
        IProductEmailSendHistoryQueries productEmailSendHistoryQueries,
        IWriteModelUnitOfWork unitOfWork,
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

            advertisementContact = await chipfindAdapter.TryGetAdvertisementContactAsync(
                saleAdvertisement,
                cancellationToken);

            var isAmbiguous = matchesWithProducts.Count > 1;

            foreach (var product in matchesWithProducts)
            {
                if (!historyByProductId.TryGetValue(product.ProductId, out var record))
                {
                    var existingId = await productEmailSendHistoryQueries.FindIdAsync(
                        productId: product.ProductId,
                        seller: saleAdvertisement.Seller,
                        marketplace: WellKnown.ChipFind.Marketplace,
                        cancellationToken: cancellationToken);

                    record = existingId is null
                        ? null
                        : await productEmailSendHistoryRepository.GetByIdAsync(existingId.Value, cancellationToken);
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

                    await productEmailSendHistoryRepository.AddAsync(newRecord, cancellationToken);
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

        await unitOfWork.SaveChangesAsync(cancellationToken);

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
            await emailSender.Send(
                targetAddress: _ebayServerOptions.TargetEmail,
                topic: emailTopic,
                messageText: emailBody);

            await Task.Delay(millisecondsDelay: DelayMilliseconds, cancellationToken: cancellationToken);
        }
    }

    private static async Task<IReadOnlyCollection<ProductInner>> GetProducts(
        ProductService productService,
        CancellationToken cancellationToken)
    {
        var products = await productService.GetAllProductsAsync(cancellationToken);

        var productsArray = products.Select(x => new ProductInner(
                ProductId: x.Data.Id,
                Regex: x.ProductRegex,
                IsInteresting: x.IsInteresting))
            .ToArray();

        return productsArray;
    }
}
