namespace Server.Adapters.Driven.ChipFind;

internal static class WellKnown
{
    /// <summary>
    /// Ключ keyed-регистрации выделенного IMemoryCache для этого адаптера.
    /// </summary>
    public const string CacheServiceKey = "chipfind-cache";

    /// <summary>
    /// Имя именованного HttpClient адаптера.
    /// </summary>
    public const string HttpClientName = "chipfind";

    /// <summary>
    /// Имя маркетплейса в истории дедупликации; совпадает со значением в уже сохранённых записях, менять нельзя.
    /// </summary>
    public const string Marketplace = "Chipfind";

    /// <summary>
    /// Имя источника спанов адаптера.
    /// </summary>
    public const string ActivitySourceName = "Server.Adapters.Driven.ChipFind";

    public const string FeedSpan = "chipfind.feed";
    public const string ContactPageSpan = "chipfind.contact-page";
    public const string AdvertisementsCountTag = "advertisements.count";
    public const string CacheHitTag = "cache.hit";
}