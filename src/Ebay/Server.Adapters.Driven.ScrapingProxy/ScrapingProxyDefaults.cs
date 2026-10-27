namespace Server.Adapters.Driven.ScrapingProxy;

/// <summary>
/// Общие значения для HTTP-клиентов, которые ходят на сторонние сайты через прокси парсеров.
/// </summary>
public static class ScrapingProxyDefaults
{
    /// <summary>
    /// User-Agent браузера: часть сайтов (и ссылка смены IP провайдера прокси) отвечает иначе клиентам без него.
    /// </summary>
    public const string BrowserUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
}
