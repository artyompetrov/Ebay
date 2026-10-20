using System.Diagnostics;
using System.Globalization;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.Qrz;

/// <summary>
/// Источник объявлений о продаже с доски qrz.ru: страницы списка каждой настроенной категории (по дате) для типов
/// «продам», «меняю», «подарю», пока на странице есть свежие объявления, затем страница каждого нового или
/// изменившегося объявления.
/// </summary>
internal sealed class QrzAdapter : ISaleAdvertisementAdapter
{
    private static readonly ActivitySource ActivitySource = new(WellKnown.Tracing.ActivitySourceName);

    private readonly ILogger<QrzAdapter> _logger;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMemoryCache _memoryCache;
    private readonly TimeProvider _timeProvider;
    private readonly QrzAdapterOptions _options;

    public QrzAdapter(
        ILogger<QrzAdapter> logger,
        IHttpClientFactory httpClientFactory,
        [FromKeyedServices(WellKnown.CacheServiceKey)] IMemoryCache memoryCache,
        TimeProvider timeProvider,
        IOptions<QrzAdapterOptions> options)
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;
        _memoryCache = memoryCache;
        _timeProvider = timeProvider;
        _options = options.Value;
    }

    public string Marketplace => WellKnown.Marketplace;

    public async Task<IReadOnlyCollection<SaleAdvertisement>> GetRecentAdvertisementsAsync(CancellationToken cancellationToken)
    {
        var listings = new Dictionary<long, QrzListing>();

        foreach (var category in _options.EffectiveCategories)
        {
            foreach (var offerType in WellKnown.OfferTypes)
            {
                foreach (var listing in await FetchRecentListingsAsync(category, offerType, cancellationToken))
                {
                    if (!listings.TryGetValue(listing.Id, out var known) || listing.Date > known.Date)
                    {
                        listings[listing.Id] = listing;
                    }
                }
            }
        }

        var result = new List<SaleAdvertisement>(listings.Count);

        foreach (var listing in listings.Values.OrderByDescending(static x => x.Date))
        {
            var advertisement = await GetAdvertisementAsync(listing, cancellationToken);

            if (advertisement is not null)
            {
                result.Add(advertisement);
            }
        }

        _logger.LogInformation(
            "Collected {AdvertisementCount} qrz.ru advertisements from {ListingCount} listings",
            result.Count,
            listings.Count);

        return result;
    }

    public Task<string?> TryGetContactAsync(SaleAdvertisement saleAdvertisement, CancellationToken cancellationToken) =>
        Task.FromResult<string?>(QrzListingPageParser.GetProfileUri(saleAdvertisement.SellerKey).ToString());

    /// <summary>
    /// Читает страницы списка по порядку, пока на них есть объявления свежее окна <see cref="QrzAdapterOptions.ListLookback"/>:
    /// массовое поднятие объявлений за несколько минут вытесняет свежие объявления с первой страницы.
    /// Остановка: страница целиком старше окна, пустая страница (за последней страницей qrz.ru отдаёт пустую),
    /// страница без новых объявлений (защита от повтора одной и той же страницы) или лимит страниц.
    /// </summary>
    private async Task<List<QrzListing>> FetchRecentListingsAsync(string category, int offerType, CancellationToken cancellationToken)
    {
        var cutoff = _timeProvider.GetUtcNow() - _options.ListLookback;
        var seenIds = new HashSet<long>();
        var result = new List<QrzListing>();

        for (var page = 1; page <= _options.MaxListPages; page++)
        {
            var listings = await FetchListPageAsync(category, offerType, page, cancellationToken);
            var newListings = listings.Where(x => seenIds.Add(x.Id)).ToArray();
            result.AddRange(newListings);

            if (newListings.Length == 0 || newListings.All(x => x.Date < cutoff))
            {
                return result;
            }
        }

        _logger.LogWarning(
            "Stopped reading qrz.ru category {Category} (type {OfferType}) at the {MaxListPages}-page limit while pages still had recent listings; older recent listings may be missed",
            category,
            offerType,
            _options.MaxListPages);

        return result;
    }

    private async Task<QrzListing[]> FetchListPageAsync(string category, int offerType, int page, CancellationToken cancellationToken)
    {
        using var activity = ActivitySource.StartActivity(WellKnown.Tracing.ListPageSpan);
        activity?.SetTag(WellKnown.Tracing.CategoryTag, category);
        activity?.SetTag(WellKnown.Tracing.OfferTypeTag, offerType);
        activity?.SetTag(WellKnown.Tracing.PageTag, page);

        var pageQuery = page == 1 ? string.Empty : $"&p={page.ToString(CultureInfo.InvariantCulture)}";
        var uri = new Uri(
            WellKnown.BaseUri,
            $"classifieds/category/{category.Trim('/')}?o=date&type={offerType.ToString(CultureInfo.InvariantCulture)}{pageQuery}");

        try
        {
            var html = await GetStringAsync(uri, cancellationToken);
            return QrzListPageParser.Parse(html, _timeProvider.GetUtcNow(), _logger);
        }
        catch (Exception e) when (!cancellationToken.IsCancellationRequested)
        {
            MarkFailed(activity, e);
            throw;
        }
    }

    private async Task<SaleAdvertisement?> GetAdvertisementAsync(QrzListing listing, CancellationToken cancellationToken)
    {
        using var activity = ActivitySource.StartActivity(WellKnown.Tracing.ListingPageSpan);
        activity?.SetTag(WellKnown.Tracing.ListingIdTag, listing.Id);

        // Ключ включает дату: поднятое или отредактированное объявление получает новую дату и перечитывается.
        var cacheKey = $"qrz-listing:{listing.Id}:{listing.Date.UtcTicks}";
        var isCacheHit = _memoryCache.TryGetValue<SaleAdvertisement?>(cacheKey, out var cached);
        activity?.SetTag(WellKnown.Tracing.CacheHitTag, isCacheHit);

        if (isCacheHit)
        {
            return cached;
        }

        string html;

        try
        {
            html = await GetStringAsync(listing.Link, cancellationToken);
        }
        catch (HttpRequestException e)
        {
            // Не кешируем: временная ошибка сети не должна скрыть объявление до смены его даты.
            MarkFailed(activity, e);
            _logger.LogWarning(e, "Failed to fetch qrz.ru listing {ListingId} from {Link}", listing.Id, listing.Link);
            return null;
        }

        // Неразбираемая страница тоже кешируется (как null), чтобы не перечитывать её каждый прогон.
        var advertisement = QrzListingPageParser.TryParse(html, listing, _logger);
        _memoryCache.Set(
            cacheKey,
            advertisement,
            new MemoryCacheEntryOptions { SlidingExpiration = WellKnown.ListingCacheSlidingExpiration });

        return advertisement;
    }

    private async Task<string> GetStringAsync(Uri uri, CancellationToken cancellationToken)
    {
        try
        {
            var httpClient = _httpClientFactory.CreateClient(WellKnown.HttpClientName);
            _logger.LogDebug("GET {Uri}", uri);
            return await httpClient.GetStringAsync(uri, cancellationToken);
        }
        finally
        {
            await Task.Delay(_options.RequestDelay, cancellationToken);
        }
    }

    private static void MarkFailed(Activity? activity, Exception exception)
    {
        activity?.SetStatus(ActivityStatusCode.Error, exception.Message);
        activity?.AddException(exception);
    }
}
