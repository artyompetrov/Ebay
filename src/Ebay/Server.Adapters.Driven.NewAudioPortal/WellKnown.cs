namespace Server.Adapters.Driven.NewAudioPortal;

internal static class WellKnown
{
    /// <summary>
    /// Ключ keyed-регистрации выделенного IMemoryCache для этого адаптера.
    /// </summary>
    public const string CacheServiceKey = "newaudioportal-cache";

    /// <summary>
    /// Имя именованного HttpClient адаптера.
    /// </summary>
    public const string HttpClientName = "newaudioportal";

    /// <summary>
    /// Имя маркетплейса в истории дедупликации.
    /// </summary>
    public const string Marketplace = "NewAudioPortal";

    public static readonly Uri BaseUri = new("https://newaudioportal.com/");

    /// <summary>
    /// Раздел «Радиорынок → Продам радиолампы.» (id и slug, как в адресе раздела).
    /// </summary>
    public static readonly string[] DefaultSections = ["197-продам-радиолампы"];

    /// <summary>
    /// Сколько собранное объявление темы живёт в кеше без обращений.
    /// </summary>
    public static readonly TimeSpan TopicCacheSlidingExpiration = TimeSpan.FromDays(14);

    public static class Tracing
    {
        public const string ActivitySourceName = "Server.Adapters.Driven.NewAudioPortal";
        public const string SectionPageSpan = "newaudioportal.section-page";
        public const string TopicSpan = "newaudioportal.topic";
        public const string SectionTag = "section";
        public const string TopicIdTag = "topic.id";
        public const string TopicPagesTag = "topic.pages";
        public const string CacheHitTag = "cache.hit";
    }
}
