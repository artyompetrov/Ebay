namespace Server.Adapters.Driven.Qrz;

internal static class WellKnown
{
    /// <summary>
    /// Ключ keyed-регистрации выделенного IMemoryCache для этого адаптера.
    /// </summary>
    public const string CacheServiceKey = "qrz-cache";

    /// <summary>
    /// Имя именованного HttpClient адаптера.
    /// </summary>
    public const string HttpClientName = "qrz";

    /// <summary>
    /// Имя маркетплейса в истории дедупликации.
    /// </summary>
    public const string Marketplace = "Qrz";

    /// <summary>
    /// User-Agent запросов: часть сайтов отвечает иначе клиентам без браузерного User-Agent.
    /// </summary>
    public const string UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

    public static readonly Uri BaseUri = new("https://www.qrz.ru/");

    public static readonly string[] DefaultCategories = ["components/tubes"];

    /// <summary>
    /// Значения параметра <c>type</c> списка объявлений: продам, меняю, подарю. «Куплю» (1) не собираем:
    /// это спрос, а не предложение.
    /// </summary>
    public static readonly int[] OfferTypes = [0, 2, 3];

    /// <summary>
    /// Сколько разобранная страница объявления живёт в кеше без обращений.
    /// </summary>
    public static readonly TimeSpan ListingCacheSlidingExpiration = TimeSpan.FromDays(14);

    /// <summary>
    /// Даты на qrz.ru показываются по московскому времени; в России нет перехода на летнее время с 2014 года,
    /// поэтому фиксированное смещение надёжнее, чем зависимость от базы часовых поясов.
    /// </summary>
    public static readonly TimeSpan MoscowOffset = TimeSpan.FromHours(3);

    public static class Tracing
    {
        public const string ActivitySourceName = "Server.Adapters.Driven.Qrz";
        public const string ListPageSpan = "qrz.list-page";
        public const string ListingPageSpan = "qrz.listing-page";
        public const string CategoryTag = "category";
        public const string OfferTypeTag = "offer.type";
        public const string ListingIdTag = "listing.id";
        public const string CacheHitTag = "cache.hit";
    }
}
