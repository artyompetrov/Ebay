namespace Server.Adapters.Driven.ScrapingProxy;

internal static class WellKnown
{
    /// <summary>
    /// Имя HttpClient для ссылки смены IP: без прокси парсеров, ведь текущий внешний IP прокси может не работать.
    /// </summary>
    public const string ChangeIpHttpClientName = "scraping-proxy-change-ip";

    /// <summary>
    /// Сколько ждать ответа на запрос смены IP; ограничивает худшее время одной попытки ротации.
    /// </summary>
    public static readonly TimeSpan ChangeIpTimeout = TimeSpan.FromSeconds(10);

    public static class Tracing
    {
        public const string ActivitySourceName = "Server.Adapters.Driven.ScrapingProxy";
        public const string ProbeSpan = "scraping-proxy.probe";
        public const string ChangeIpSpan = "scraping-proxy.change-ip";
        public const string UrlFullTag = "url.full";
        public const string AttemptTag = "attempt";
        public const string ProbeBytesTag = "probe.bytes";
        public const string NewIpTag = "new_ip";
    }
}
