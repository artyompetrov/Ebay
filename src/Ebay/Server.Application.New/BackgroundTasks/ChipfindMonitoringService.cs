using System.Text.RegularExpressions;
using Server.Application.Abstractions.Driven.Abstractions.BackgroundTasks;
using Server.Application.Abstractions.Driven.Models.BackgroundTasks;

namespace Server.Application.New.BackgroundTasks;

/// <summary>
/// Обрабатывает объявления Chipfind в фоне.
/// </summary>
public class ChipfindMonitoringService
{
    private const int DelayMilliseconds = 5000;
    private readonly IBackgroundTaskSettings _settings;
    private readonly IChipfindGateway _chipfindGateway;
    private readonly IEmailGateway _emailGateway;
    private readonly ProductService _productService;
    private readonly IProductEmailSendHistoryRepository _productEmailSendHistoryRepository;

    /// <summary>
    /// Создает сервис мониторинга Chipfind.
    /// </summary>
    public ChipfindMonitoringService(
        IBackgroundTaskSettings settings,
        IChipfindGateway chipfindGateway,
        IEmailGateway emailGateway,
        ProductService productService,
        IProductEmailSendHistoryRepository productEmailSendHistoryRepository)
    {
        _settings = settings;
        _chipfindGateway = chipfindGateway;
        _emailGateway = emailGateway;
        _productService = productService;
        _productEmailSendHistoryRepository = productEmailSendHistoryRepository;
    }

    /// <summary>
    /// Загружает и обрабатывает последние объявления.
    /// </summary>
    public async Task ProcessRecentAdvertisementsAsync(CancellationToken cancellationToken)
    {
        if (_settings.IsLocalRun)
        {
            return;
        }

        var products = await GetProducts(cancellationToken);
        var recentAdvertisements = await _chipfindGateway.GetRecentSaleAdvertisementsAsync(cancellationToken);

        foreach (var advertisement in recentAdvertisements)
        {
            await ProcessAdvertisement(advertisement, products, cancellationToken);
        }
    }

    private async Task ProcessAdvertisement(
        SaleAdvertisementDto saleAdvertisement,
        IReadOnlyCollection<ProductInner> products,
        CancellationToken cancellationToken)
    {
                var newInterestingAds = new HashSet<(bool IsAmbiguous, string Ad, string? Contact)>();
        string? advertisementContact = null;

        foreach (var saleAdvertisementItem in saleAdvertisement.Items)
        {
            var matchesWithProducts = products.Where(x => x.Regex.IsMatch(saleAdvertisementItem)).ToList();
            if (matchesWithProducts.Count == 0)
            {
                continue;
            }

            advertisementContact = await _chipfindGateway.TryGetAdvertisementContactAsync(saleAdvertisement, cancellationToken);
            var isAmbiguous = matchesWithProducts.Count > 1;

            foreach (var product in matchesWithProducts)
            {
                var record = await _productEmailSendHistoryRepository.GetByProductAndSellerAsync(
                    product.ProductId,
                    saleAdvertisement.Seller,
                    BackgroundTaskSchedule.ChipfindMarketplace,
                    cancellationToken);

                if (record is null)
                {
                    var newRecord = new ProductEmailSendHistoryRecord(
                        product.ProductId,
                        saleAdvertisement.Seller,
                        saleAdvertisement.Link.ToString(),
                        advertisementContact,
                        BackgroundTaskSchedule.ChipfindMarketplace,
                        isAmbiguous,
                        saleAdvertisement.Date);

                    await _productEmailSendHistoryRepository.AddAsync(newRecord, cancellationToken);

                    if (product.IsInteresting)
                    {
                        _ = newInterestingAds.Add((isAmbiguous, saleAdvertisementItem, advertisementContact));
                    }
                }
                else
                {
                    var updated = record with
                    {
                        Link = saleAdvertisement.Link.ToString(),
                        CreatedAt = saleAdvertisement.Date,
                        IsAmbiguous = isAmbiguous,
                        Contact = string.IsNullOrWhiteSpace(advertisementContact) ? record.Contact : advertisementContact
                    };

                    await _productEmailSendHistoryRepository.UpdateAsync(updated, cancellationToken);
                }
            }
        }

        await _productEmailSendHistoryRepository.SaveChangesAsync(cancellationToken);

        if (newInterestingAds.Count > 0)
        {
            var newItems = string.Join(" ", newInterestingAds.Select(x =>
                x.Ad + (x.IsAmbiguous ? " [Нашлось несколько товаров] " : "")).Select(x => $"<div>{x}</div>"));
            var emailBody = $"<a href=\"{saleAdvertisement.Link}\">ссылка</a><br><br>{newItems}<br><div>{advertisementContact}</div>";
            var emailTopic = $"{saleAdvertisement.Title} [{saleAdvertisement.Seller}]";

            await _emailGateway.SendAsync(_settings.TargetEmail, emailTopic, emailBody);
            await Task.Delay(DelayMilliseconds, cancellationToken);
        }

    }

    private async Task<IReadOnlyCollection<ProductInner>> GetProducts(CancellationToken cancellationToken)
    {
        var products = await _productService.GetAllProductsAsync(cancellationToken);
        return products.Select(x => new ProductInner(x.Data.Id, x.ProductRegex, x.IsInteresting)).ToArray();
    }

    private sealed record ProductInner(Guid ProductId, Regex Regex, bool IsInteresting);
}
