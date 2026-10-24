using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Domain;
using Server.Domain.SaleAdvertisements;

namespace Server.Application.SaleAdvertisements;

/// <summary>
/// Сценарий мониторинга объявлений о продаже на сторонних маркетплейсах: сопоставляет свежие объявления с товарами,
/// ведёт историю дедупликации по товару, продавцу и маркетплейсу и уведомляет о новых интересных объявлениях.
/// </summary>
public class SaleAdvertisementMonitoringService
{
    private readonly ILogger<SaleAdvertisementMonitoringService> _logger;
    private readonly IProductEmailSendHistoryRepository _productEmailSendHistoryRepository;
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;
    private readonly ISaleAdvertisementAdapter[] _adapters;
    private readonly ISaleAdvertisementNotificationAdapter _notificationAdapter;
    private readonly ProductService _productService;
    private readonly ICurrencyQueries _currencyQueries;

    /// <summary>
    /// Создает сервис мониторинга объявлений о продаже.
    /// </summary>
    public SaleAdvertisementMonitoringService(
        ILogger<SaleAdvertisementMonitoringService> logger,
        IProductEmailSendHistoryRepository productEmailSendHistoryRepository,
        IWriteModelUnitOfWorkFactory unitOfWorkFactory,
        IEnumerable<ISaleAdvertisementAdapter> adapters,
        ISaleAdvertisementNotificationAdapter notificationAdapter,
        ProductService productService,
        ICurrencyQueries currencyQueries)
    {
        _logger = logger;
        _productEmailSendHistoryRepository = productEmailSendHistoryRepository;
        _unitOfWorkFactory = unitOfWorkFactory;
        _adapters = [.. adapters];
        _notificationAdapter = notificationAdapter;
        _productService = productService;
        _currencyQueries = currencyQueries;
    }

    private sealed record ProductInner(
        Guid ProductId,
        string Name,
        Regex Regex,
        bool IsInteresting,
        double RevenueAvgUsd,
        int QuantityTotal);

    private enum Sighting
    {
        Created,
        Updated
    }

    /// <summary>
    /// Обрабатывает свежие объявления со всех маркетплейсов и отправляет письма о новых интересных объявлениях.
    /// Ошибка одного маркетплейса логируется и не мешает обработке остальных.
    /// </summary>
    /// <param name="targetEmail">Адрес, на который отправляются уведомления.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    public async Task ProcessRecentAdvertisementsAsync(string targetEmail, CancellationToken cancellationToken)
    {
        using var activity = SaleAdvertisementsTracing.ActivitySource.StartActivity(SaleAdvertisementsTracing.RunSpan);

        var products = await GetProducts(cancellationToken);
        var targetRate = await GetTargetRateAsync(cancellationToken);

        foreach (var adapter in _adapters)
        {
            await ProcessSourceIsolatedAsync(targetEmail, adapter, products, targetRate, cancellationToken);
        }
    }

    private async Task ProcessSourceIsolatedAsync(
        string targetEmail,
        ISaleAdvertisementAdapter adapter,
        IReadOnlyCollection<ProductInner> products,
        ExchangeRate? targetRate,
        CancellationToken cancellationToken)
    {
        using var activity = SaleAdvertisementsTracing.ActivitySource.StartActivity(SaleAdvertisementsTracing.SourceSpan);
        activity?.SetTag(SaleAdvertisementsTracing.MarketplaceTag, adapter.Marketplace);

        try
        {
            _logger.LogInformation("Starting processing advertisements from {Marketplace}", adapter.Marketplace);
            
            var advertisements = await adapter.GetRecentAdvertisementsAsync(cancellationToken);
            activity?.SetTag(SaleAdvertisementsTracing.AdvertisementsCountTag, advertisements.Count);

            foreach (var advertisement in advertisements)
            {
                await ProcessAdvertisementAsync(
                    targetEmail,
                    adapter,
                    advertisement,
                    products,
                    targetRate,
                    cancellationToken);
            }
            
            _logger.LogInformation("Successfully processed advertisements from {Marketplace}", adapter.Marketplace);
        }
        catch (Exception e) when (!cancellationToken.IsCancellationRequested)
        {
            SaleAdvertisementsTracing.MarkFailed(activity, e);
            _logger.LogError(e, "Failed to process sale advertisements from {Marketplace}", adapter.Marketplace);
        }
    }

    private async Task ProcessAdvertisementAsync(
        string targetEmail,
        ISaleAdvertisementAdapter adapter,
        SaleAdvertisement saleAdvertisement,
        IReadOnlyCollection<ProductInner> products,
        ExchangeRate? targetRate,
        CancellationToken cancellationToken)
    {
        using var activity = SaleAdvertisementsTracing.ActivitySource.StartActivity(SaleAdvertisementsTracing.AdvertisementSpan);
        activity?.SetTag(SaleAdvertisementsTracing.MarketplaceTag, adapter.Marketplace);
        activity?.SetTag(SaleAdvertisementsTracing.SellerKeyTag, saleAdvertisement.SellerKey);
        activity?.SetTag(SaleAdvertisementsTracing.LinkTag, saleAdvertisement.Link.ToString());

        try
        {
            await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

            // Кеш агрегатов, уже загруженных или созданных в рамках обработки этого объявления: один товар может
            // встретиться в нескольких строках объявления, а созданная запись ещё не сохранена в БД.
            var historyByProductId = new Dictionary<Guid, ProductEmailSendHistory>();
            var lineMatches = new List<SaleAdvertisementLineMatch>();
            string? contact = null;
            var isContactResolved = false;

            foreach (var line in saleAdvertisement.Items)
            {
                var matchedProducts = products.Where(x => x.Regex.IsMatch(line)).ToArray();

                if (matchedProducts.Length == 0)
                {
                    continue;
                }

                if (!isContactResolved)
                {
                    contact = await TryGetContactAsync(adapter, saleAdvertisement, cancellationToken);
                    isContactResolved = true;
                }

                var isAmbiguous = matchedProducts.Length > 1;
                var productMatches = new List<SaleAdvertisementProductMatch>(matchedProducts.Length);

                foreach (var product in matchedProducts)
                {
                    var sighting = await RecordSightingAsync(
                        unitOfWork,
                        adapter.Marketplace,
                        saleAdvertisement,
                        product,
                        isAmbiguous,
                        contact,
                        historyByProductId,
                        cancellationToken);

                    productMatches.Add(new SaleAdvertisementProductMatch(
                        ProductId: product.ProductId,
                        Name: product.Name,
                        RevenueAvgUsd: product.RevenueAvgUsd,
                        QuantityTotal: product.QuantityTotal,
                        IsInteresting: product.IsInteresting,
                        IsNewlyRecorded: sighting == Sighting.Created));
                }

                lineMatches.Add(new SaleAdvertisementLineMatch(line, productMatches));
            }

            var notification = SaleAdvertisementNotification.Compose(
                title: saleAdvertisement.Title,
                sellerName: saleAdvertisement.SellerName,
                link: saleAdvertisement.Link,
                contact: contact,
                lineMatches: lineMatches,
                targetRate: targetRate);

            activity?.SetTag(SaleAdvertisementsTracing.MatchesCountTag, historyByProductId.Count);

            // Deferred commit: if the email send below fails, the history rows written by SaveChangesAsync
            // must not persist, or the retry on the next run will see them as "already notified" and
            // silently drop the notification for good. This is why several history aggregates share one
            // transaction - a deliberate exception to "one aggregate per transaction" required by the spec.
            await using var transaction = await unitOfWork.BeginTransactionAsync(cancellationToken);

            await unitOfWork.SaveChangesAsync(cancellationToken);

            if (notification is not null)
            {
                await SendNotificationAsync(targetEmail, notification, cancellationToken);
            }

            await transaction.CommitAsync(cancellationToken);
        }
        catch (Exception e) when (!cancellationToken.IsCancellationRequested)
        {
            SaleAdvertisementsTracing.MarkFailed(activity, e);
            throw;
        }
    }

    private async Task<Sighting> RecordSightingAsync(
        IWriteModelUnitOfWork unitOfWork,
        string marketplace,
        SaleAdvertisement saleAdvertisement,
        ProductInner product,
        bool isAmbiguous,
        string? contact,
        Dictionary<Guid, ProductEmailSendHistory> historyByProductId,
        CancellationToken cancellationToken)
    {
        if (!historyByProductId.TryGetValue(product.ProductId, out var record))
        {
            record = await _productEmailSendHistoryRepository.FindAsync(
                unitOfWork,
                productId: product.ProductId,
                sellerKey: saleAdvertisement.SellerKey,
                marketplace: marketplace,
                cancellationToken: cancellationToken);
        }

        if (record is null)
        {
            var newRecord = ProductEmailSendHistory.Create(
                productId: product.ProductId,
                sellerKey: saleAdvertisement.SellerKey,
                sellerName: saleAdvertisement.SellerName,
                link: saleAdvertisement.Link.ToString(),
                marketplace: marketplace,
                isAmbiguous: isAmbiguous,
                advertisementDate: saleAdvertisement.Date,
                contact: contact);

            await _productEmailSendHistoryRepository.AddAsync(unitOfWork, newRecord, cancellationToken);
            historyByProductId[product.ProductId] = newRecord;

            return Sighting.Created;
        }

        record.UpdateForNewAdvertisement(
            link: saleAdvertisement.Link.ToString(),
            advertisementDate: saleAdvertisement.Date,
            isAmbiguous: isAmbiguous,
            sellerName: saleAdvertisement.SellerName,
            contact: contact);
        historyByProductId[product.ProductId] = record;

        return Sighting.Updated;
    }

    private static async Task<string?> TryGetContactAsync(
        ISaleAdvertisementAdapter adapter,
        SaleAdvertisement saleAdvertisement,
        CancellationToken cancellationToken)
    {
        using var activity = SaleAdvertisementsTracing.ActivitySource.StartActivity(SaleAdvertisementsTracing.ContactSpan);
        activity?.SetTag(SaleAdvertisementsTracing.MarketplaceTag, adapter.Marketplace);

        try
        {
            return await adapter.TryGetContactAsync(saleAdvertisement, cancellationToken);
        }
        catch (Exception e) when (!cancellationToken.IsCancellationRequested)
        {
            SaleAdvertisementsTracing.MarkFailed(activity, e);
            throw;
        }
    }

    private async Task SendNotificationAsync(
        string targetEmail,
        SaleAdvertisementNotification notification,
        CancellationToken cancellationToken)
    {
        using var activity = SaleAdvertisementsTracing.ActivitySource.StartActivity(SaleAdvertisementsTracing.NotifySpan);

        try
        {
            await _notificationAdapter.SendAsync(targetEmail, notification, cancellationToken);
        }
        catch (Exception e) when (!cancellationToken.IsCancellationRequested)
        {
            SaleAdvertisementsTracing.MarkFailed(activity, e);
            throw;
        }

        _logger.LogInformation("Notification sent for advertisement {AdvertisementTitle}", notification.Title);
    }

    private async Task<ExchangeRate?> GetTargetRateAsync(CancellationToken cancellationToken)
    {
        var rates = await _currencyQueries.GetCurrencyRatesAsync(cancellationToken);

        if (rates.TryGetValue(WellKnown.CurrencyRate.TargetCurrency, out var rate))
        {
            return new ExchangeRate(WellKnown.CurrencyRate.TargetCurrency, rate);
        }

        _logger.LogWarning(
            "Currency rate for {Currency} is not available, estimated prices in notifications are shown in {BaseCurrency}",
            WellKnown.CurrencyRate.TargetCurrency,
            WellKnown.CurrencyRate.BaseCurrency);

        return null;
    }

    private async Task<IReadOnlyCollection<ProductInner>> GetProducts(CancellationToken cancellationToken)
    {
        var products = await _productService.GetAllProductsAsync(cancellationToken);

        return products.Select(static x => new ProductInner(
                ProductId: x.Data.Id,
                Name: x.Data.Name,
                Regex: x.ProductRegex,
                IsInteresting: x.IsInteresting,
                RevenueAvgUsd: x.Data.CalculationResult?.RevenueAvg ?? 0,
                QuantityTotal: x.Data.CalculationResult?.QuantityTotal ?? 0))
            .ToArray();
    }
}
