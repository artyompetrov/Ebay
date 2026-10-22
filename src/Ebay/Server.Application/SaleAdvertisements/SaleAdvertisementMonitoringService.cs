using System.Globalization;
using System.Net;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Domain;

namespace Server.Application.SaleAdvertisements;

/// <summary>
/// Сценарий мониторинга объявлений о продаже на сторонних маркетплейсах: сопоставляет свежие объявления с товарами,
/// ведёт историю дедупликации по товару, продавцу и маркетплейсу и уведомляет о новых интересных объявлениях.
/// </summary>
public class SaleAdvertisementMonitoringService
{
    private const string AmbiguousLineMarker = " [Нашлось несколько товаров] ";

    private readonly ILogger<SaleAdvertisementMonitoringService> _logger;
    private readonly IProductEmailSendHistoryRepository _productEmailSendHistoryRepository;
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;
    private readonly ISaleAdvertisementAdapter[] _adapters;
    private readonly IEmailSender _emailSender;
    private readonly ProductService _productService;
    private readonly ICurrencyQueries _currencyQueries;
    private readonly TimeSpan _delayAfterEmail;

    /// <summary>
    /// Создает сервис мониторинга объявлений о продаже.
    /// </summary>
    public SaleAdvertisementMonitoringService(
        ILogger<SaleAdvertisementMonitoringService> logger,
        IProductEmailSendHistoryRepository productEmailSendHistoryRepository,
        IWriteModelUnitOfWorkFactory unitOfWorkFactory,
        IEnumerable<ISaleAdvertisementAdapter> adapters,
        IEmailSender emailSender,
        ProductService productService,
        ICurrencyQueries currencyQueries)
        : this(
            logger,
            productEmailSendHistoryRepository,
            unitOfWorkFactory,
            adapters,
            emailSender,
            productService,
            currencyQueries,
            WellKnown.SaleAdvertisements.DelayAfterEmail)
    {
    }

    internal SaleAdvertisementMonitoringService(
        ILogger<SaleAdvertisementMonitoringService> logger,
        IProductEmailSendHistoryRepository productEmailSendHistoryRepository,
        IWriteModelUnitOfWorkFactory unitOfWorkFactory,
        IEnumerable<ISaleAdvertisementAdapter> adapters,
        IEmailSender emailSender,
        ProductService productService,
        ICurrencyQueries currencyQueries,
        TimeSpan delayAfterEmail)
    {
        _logger = logger;
        _productEmailSendHistoryRepository = productEmailSendHistoryRepository;
        _unitOfWorkFactory = unitOfWorkFactory;
        _adapters = [.. adapters];
        _emailSender = emailSender;
        _productService = productService;
        _currencyQueries = currencyQueries;
        _delayAfterEmail = delayAfterEmail;
    }

    private sealed record ProductInner(
        Guid ProductId,
        string Name,
        Regex Regex,
        bool IsInteresting,
        double RevenueAvgUsd,
        int QuantityTotal);

    private sealed record NotifiedLine(string Line, bool IsAmbiguous);

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
        var targetCurrencyRate = await GetTargetCurrencyRateAsync(cancellationToken);

        foreach (var adapter in _adapters)
        {
            await ProcessSourceIsolatedAsync(targetEmail, adapter, products, targetCurrencyRate, cancellationToken);
        }
    }

    private async Task ProcessSourceIsolatedAsync(
        string targetEmail,
        ISaleAdvertisementAdapter adapter,
        IReadOnlyCollection<ProductInner> products,
        double? targetCurrencyRate,
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
                    targetCurrencyRate,
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
        double? targetCurrencyRate,
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
            var newInterestingProductIds = new HashSet<Guid>();
            var notifiedProducts = new List<ProductInner>();
            var notifiedLines = new List<NotifiedLine>();
            var notifiedLineTexts = new HashSet<string>();
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
                var isLineNotified = false;

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

                    if (sighting == Sighting.Created && product.IsInteresting && newInterestingProductIds.Add(product.ProductId))
                    {
                        notifiedProducts.Add(product);
                    }

                    isLineNotified |= newInterestingProductIds.Contains(product.ProductId);
                }

                if (isLineNotified && notifiedLineTexts.Add(line))
                {
                    notifiedLines.Add(new NotifiedLine(line, isAmbiguous));
                }
            }

            activity?.SetTag(SaleAdvertisementsTracing.MatchesCountTag, historyByProductId.Count);

            // Deferred commit: if the email send below fails, the history rows written by SaveChangesAsync
            // must not persist, or the retry on the next run will see them as "already notified" and
            // silently drop the notification for good.
            await using var transaction = await unitOfWork.BeginTransactionAsync(cancellationToken);

            await unitOfWork.SaveChangesAsync(cancellationToken);

            if (notifiedLines.Count > 0)
            {
                await SendNotificationAsync(
                    targetEmail,
                    saleAdvertisement,
                    notifiedLines,
                    notifiedProducts,
                    targetCurrencyRate,
                    contact);
            }

            await transaction.CommitAsync(cancellationToken);

            if (notifiedLines.Count > 0)
            {
                await Task.Delay(_delayAfterEmail, cancellationToken);
            }
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
        SaleAdvertisement saleAdvertisement,
        IReadOnlyCollection<NotifiedLine> notifiedLines,
        IEnumerable<ProductInner> notifiedProducts,
        double? targetCurrencyRate,
        string? contact)
    {
        using var activity = SaleAdvertisementsTracing.ActivitySource.StartActivity(SaleAdvertisementsTracing.NotifySpan);

        var newItems = string.Join(
            separator: " ",
            values: notifiedLines.Select(static x => $"<div>{x.Line}{(x.IsAmbiguous ? AmbiguousLineMarker : "")}</div>"));
        var priceTable = BuildPriceTable(notifiedProducts, targetCurrencyRate);
        var emailBody = $"<a href=\"{saleAdvertisement.Link}\">ссылка</a><br><br>{newItems}<br>{priceTable}<br><div>{contact}</div>";
        var emailTopic = $"{saleAdvertisement.Title} [{saleAdvertisement.SellerName}]";

        try
        {
            await _emailSender.Send(
                targetAddress: targetEmail,
                topic: emailTopic,
                messageText: emailBody);
        }
        catch (Exception e)
        {
            SaleAdvertisementsTracing.MarkFailed(activity, e);
            throw;
        }

        _logger.LogInformation("Email sent {EmailTopic}", emailTopic);
        _logger.LogDebug("Email sent {EmailBody}", emailBody);
    }

    private static string BuildPriceTable(IEnumerable<ProductInner> notifiedProducts, double? targetCurrencyRate)
    {
        var rows = string.Concat(notifiedProducts.Select(x =>
            $"<tr><td>{WebUtility.HtmlEncode(x.Name)}</td>" +
            $"<td>{FormatEstimatedPrice(x.RevenueAvgUsd, targetCurrencyRate)}</td>" +
            $"<td>{x.QuantityTotal.ToString(CultureInfo.InvariantCulture)}</td></tr>"));

        return "<table border=\"1\" cellpadding=\"4\" style=\"border-collapse:collapse\">" +
               "<tr><th>Товар</th><th>Оценка</th><th>Продано шт.</th></tr>" +
               rows +
               "</table>";
    }

    private static string FormatEstimatedPrice(double revenueAvgUsd, double? targetCurrencyRate)
    {
        var (amount, currency) = targetCurrencyRate is { } rate
            ? (revenueAvgUsd * rate, WellKnown.CurrencyRate.TargetCurrency)
            : (revenueAvgUsd, WellKnown.CurrencyRate.BaseCurrency);

        var rounded = Math.Round(amount, MidpointRounding.AwayFromZero);

        return $"{rounded.ToString("0", CultureInfo.InvariantCulture)} {currency}";
    }

    private async Task<double?> GetTargetCurrencyRateAsync(CancellationToken cancellationToken)
    {
        var rates = await _currencyQueries.GetCurrencyRatesAsync(cancellationToken);

        if (rates.TryGetValue(WellKnown.CurrencyRate.TargetCurrency, out var rate))
        {
            return rate;
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
