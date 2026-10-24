using System.Diagnostics;
using System.Globalization;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OneOf;
using OneOf.Types;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.NewAudioPortal;

/// <summary>
/// Источник объявлений о продаже с форума newaudioportal.com: первая страница каждого настроенного раздела (темы по
/// последней активности), затем первая и последняя страницы каждой темы с новым сообщением. Тема - объявление её автора.
/// </summary>
internal sealed partial class NewAudioPortalAdapter : ISaleAdvertisementAdapter
{
    private const int FirstPage = 1;
    private const string EmptySlugFallback = "user";

    private static readonly ActivitySource ActivitySource = new(WellKnown.Tracing.ActivitySourceName);

    private readonly ILogger<NewAudioPortalAdapter> _logger;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMemoryCache _memoryCache;
    private readonly NewAudioPortalAdapterOptions _options;

    public NewAudioPortalAdapter(
        ILogger<NewAudioPortalAdapter> logger,
        IHttpClientFactory httpClientFactory,
        [FromKeyedServices(WellKnown.CacheServiceKey)] IMemoryCache memoryCache,
        IOptions<NewAudioPortalAdapterOptions> options)
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;
        _memoryCache = memoryCache;
        _options = options.Value;
    }

    public string Marketplace => WellKnown.Marketplace;

    public async Task<OneOf<IReadOnlyCollection<SaleAdvertisement>, Error<string>>> GetRecentAdvertisementsAsync(CancellationToken cancellationToken)
    {
        var topics = new Dictionary<long, NewAudioPortalTopicRow>();

        foreach (var section in _options.EffectiveSections)
        {
            var sectionTopics = await FetchSectionPageAsync(section, cancellationToken);

            if (sectionTopics.TryPickT1(out var error, out var rows))
            {
                return error;
            }

            foreach (var row in rows)
            {
                topics.TryAdd(row.Id, row);
            }
        }

        var result = new List<SaleAdvertisement>(topics.Count);
        var topicsWithoutAuthor = 0;

        foreach (var topic in topics.Values.OrderByDescending(static x => x.LastPostDate))
        {
            var advertisement = await GetAdvertisementAsync(topic, cancellationToken);

            advertisement.Switch(
                result.Add,
                _ => topicsWithoutAuthor++,
                static _ => { });
        }

        // Ни у одной прочитанной темы нет автора - скорее всего, сменилась разметка: без ошибки сбор выглядел бы как
        // тихий раздел, а закешированные темы без автора заглушили бы и предупреждения.
        if (result.Count == 0 && topicsWithoutAuthor > 0)
        {
            return new Error<string>($"none of {topicsWithoutAuthor} newaudioportal.com topics has an opening post author with a profile link");
        }

        _logger.LogInformation(
            "Collected {AdvertisementCount} newaudioportal.com advertisements from {TopicCount} topics",
            result.Count,
            topics.Count);

        return result;
    }

    public Task<string?> TryGetContactAsync(SaleAdvertisement saleAdvertisement, CancellationToken cancellationToken) =>
        Task.FromResult<string?>(GetProfileUri(saleAdvertisement.SellerKey, saleAdvertisement.SellerName).AbsoluteUri);

    /// <summary>
    /// Ссылка на профиль: сайт требует непустой slug после id (иначе 404) и перенаправляет любой slug на профиль.
    /// </summary>
    internal static Uri GetProfileUri(string sellerKey, string sellerName)
    {
        var slug = WhitespaceRegex().Replace(sellerName.Trim().ToLower(CultureInfo.InvariantCulture), "-");
        var escapedSlug = slug.Length > 0 ? Uri.EscapeDataString(slug) : EmptySlugFallback;
        return new Uri(WellKnown.BaseUri, $"profile/{sellerKey}-{escapedSlug}/");
    }

    private async Task<OneOf<NewAudioPortalTopicRow[], Error<string>>> FetchSectionPageAsync(string section, CancellationToken cancellationToken)
    {
        using var activity = ActivitySource.StartActivity(WellKnown.Tracing.SectionPageSpan);
        activity?.SetTag(WellKnown.Tracing.SectionTag, section);

        var uri = new Uri(WellKnown.BaseUri, $"forum/{section.Trim('/')}/");

        try
        {
            var page = await GetPageAsync(uri, cancellationToken);
            var rows = page.TryPickT1(out var error, out var html)
                ? error
                : NewAudioPortalSectionPageParser.Parse(html, _logger);

            if (rows.TryPickT1(out var failure, out _))
            {
                activity?.SetStatus(ActivityStatusCode.Error, failure.Value);
            }

            return rows;
        }
        catch (Exception e) when (!cancellationToken.IsCancellationRequested)
        {
            MarkFailed(activity, e);
            throw;
        }
    }

    /// <summary>
    /// Объявление темы; <see cref="None"/>, если у первого сообщения нет автора с профилем; <see cref="Error{T}"/>, если
    /// тему не удалось прочитать в этот раз.
    /// </summary>
    private async Task<OneOf<SaleAdvertisement, None, Error<string>>> GetAdvertisementAsync(NewAudioPortalTopicRow topic, CancellationToken cancellationToken)
    {
        using var activity = ActivitySource.StartActivity(WellKnown.Tracing.TopicSpan);
        activity?.SetTag(WellKnown.Tracing.TopicIdTag, topic.Id);

        // Ключ включает время последнего сообщения: любой новый ответ в теме - повод перечитать её вместе с шапкой.
        var cacheKey = $"newaudioportal-topic:{topic.Id}:{topic.LastPostDate.UtcTicks}";
        var isCacheHit = _memoryCache.TryGetValue<SaleAdvertisement?>(cacheKey, out var cached);
        activity?.SetTag(WellKnown.Tracing.CacheHitTag, isCacheHit);

        if (isCacheHit)
        {
            return ToResult(cached);
        }

        OneOf<NewAudioPortalTopicPage[], Error<string>> pages;

        try
        {
            pages = await ReadTopicPagesAsync(topic, cancellationToken);
        }
        catch (Exception e) when (!cancellationToken.IsCancellationRequested)
        {
            MarkFailed(activity, e);
            throw;
        }

        if (pages.TryPickT1(out var error, out var topicPages))
        {
            // Не кешируем: временная ошибка или заглушка вместо темы не должны скрыть тему до её следующего сообщения.
            activity?.SetStatus(ActivityStatusCode.Error, error.Value);
            _logger.LogWarning("Skipping newaudioportal.com topic {TopicId} from {Link}: {Error}", topic.Id, topic.Link, error.Value);
            return error;
        }

        activity?.SetTag(WellKnown.Tracing.TopicPagesTag, topicPages[0].PageCount);

        // Тема без автора с профилем тоже кешируется (как null), чтобы не перечитывать её каждый прогон.
        var advertisement = NewAudioPortalAdvertisementBuilder.TryBuild(topic, topicPages, _logger);
        _memoryCache.Set(
            cacheKey,
            advertisement,
            new MemoryCacheEntryOptions { SlidingExpiration = WellKnown.TopicCacheSlidingExpiration });

        return ToResult(advertisement);
    }

    private static OneOf<SaleAdvertisement, None, Error<string>> ToResult(SaleAdvertisement? advertisement) =>
        advertisement is null ? new None() : advertisement;

    /// <summary>
    /// Первая страница (шапка) и, если страниц несколько, последняя (свежие сообщения); средние страницы не читаются.
    /// </summary>
    private async Task<OneOf<NewAudioPortalTopicPage[], Error<string>>> ReadTopicPagesAsync(NewAudioPortalTopicRow topic, CancellationToken cancellationToken)
    {
        var firstPage = await ReadTopicPageAsync(topic.Link, cancellationToken);

        if (firstPage.TryPickT1(out var error, out var first))
        {
            return error;
        }

        if (first.PageCount == FirstPage)
        {
            return new[] { first };
        }

        var lastPage = await ReadTopicPageAsync(
            new Uri(topic.Link, $"page/{first.PageCount.ToString(CultureInfo.InvariantCulture)}/"),
            cancellationToken);

        return lastPage.TryPickT1(out var lastError, out var last)
            ? lastError
            : new[] { first, last };
    }

    private async Task<OneOf<NewAudioPortalTopicPage, Error<string>>> ReadTopicPageAsync(Uri uri, CancellationToken cancellationToken)
    {
        OneOf<string, Error<string>> page;

        try
        {
            page = await GetPageAsync(uri, cancellationToken);
        }
        catch (Exception e) when (e is HttpRequestException or TaskCanceledException && !cancellationToken.IsCancellationRequested)
        {
            // Исключение пишем здесь, где оно ещё есть: дальше уходит только текст ошибки.
            Activity.Current?.AddException(e);
            _logger.LogWarning(e, "Failed to fetch newaudioportal.com page {Uri}", uri);
            return new Error<string>($"failed to fetch {uri}: {e.Message}");
        }

        return page.TryPickT1(out var error, out var html)
            ? error
            : NewAudioPortalTopicPageParser.Parse(html, _logger);
    }

    private async Task<OneOf<string, Error<string>>> GetPageAsync(Uri uri, CancellationToken cancellationToken)
    {
        try
        {
            var httpClient = _httpClientFactory.CreateClient(WellKnown.HttpClientName);
            _logger.LogDebug("GET {Uri}", uri);
            using var response = await httpClient.GetAsync(uri, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                return new Error<string>($"{uri} answered {(int)response.StatusCode} ({response.StatusCode})");
            }

            return await response.Content.ReadAsStringAsync(cancellationToken);
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

    [GeneratedRegex(@"\s+")]
    private static partial Regex WhitespaceRegex();
}
