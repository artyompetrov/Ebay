using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Text;

namespace Server.Adapters.Driven.ScrapingProxy;

/// <summary>
/// HTTP-прокси для адаптеров, которые парсят сторонние сайты (qrz.ru, chipfind.ru, newaudioportal.com), чтобы не
/// светить им IP сервера, и смена его внешнего IP, когда сайт через текущий IP не открывается.
/// Переменные окружения <c>ScrapingProxy__Address</c>, <c>ScrapingProxy__Username</c>, <c>ScrapingProxy__Password</c>,
/// <c>ScrapingProxy__ChangeIpUrl</c>, <c>ScrapingProxy__MaxIpChangeAttempts</c>, <c>ScrapingProxy__ProbeTimeout</c>,
/// <c>ScrapingProxy__IpChangeDelay</c>. Пустой адрес означает прямое подключение без проб.
/// </summary>
internal sealed record ScrapingProxyOptions : IValidatableObject
{
    public const string SectionName = "ScrapingProxy";

    private const int MinIpChangeAttempts = 1;
    private const int MaxIpChangeAttemptsLimit = 100;

    /// <summary>
    /// Провайдер отклоняет тот же запрос смены IP, повторённый быстрее чем за 3-5 секунд.
    /// </summary>
    private static readonly TimeSpan MinIpChangeDelay = TimeSpan.FromSeconds(5);

    /// <summary>
    /// Адрес прокси, абсолютный <c>http://host:port</c> без логина и пароля внутри.
    /// </summary>
    public string? Address { get; init; }

    public string? Username { get; init; }

    public string? Password { get; init; }

    /// <summary>
    /// Ссылка смены внешнего IP прокси у провайдера (<c>https://changeip.mobileproxy.space/?proxy_key=...&amp;format=json</c>).
    /// Секрет: содержит ключ прокси, поэтому не попадает ни в логи, ни в трейсы, ни в <see cref="ToString"/>.
    /// Пустая ссылка - проба без смены IP.
    /// </summary>
    public string? ChangeIpUrl { get; init; }

    /// <summary>
    /// Сколько раз менять IP, пока проба сайта не пройдёт.
    /// </summary>
    public int MaxIpChangeAttempts { get; init; } = 20;

    /// <summary>
    /// За сколько должна прийти главная страница сайта целиком, чтобы проба прошла.
    /// </summary>
    public TimeSpan ProbeTimeout { get; init; } = TimeSpan.FromSeconds(15);

    /// <summary>
    /// Пауза после запроса смены IP перед следующей пробой: провайдеру нужно время переключить IP.
    /// </summary>
    public TimeSpan IpChangeDelay { get; init; } = TimeSpan.FromSeconds(10);

    internal bool HasCredentials => !string.IsNullOrWhiteSpace(Username) || !string.IsNullOrWhiteSpace(Password);

    /// <summary>
    /// Разобранный адрес прокси или <see langword="null"/>, если прокси не задан.
    /// </summary>
    internal Uri? AddressUri => string.IsNullOrWhiteSpace(Address) ? null : new Uri(Address, UriKind.Absolute);

    /// <summary>
    /// Разобранная ссылка смены IP или <see langword="null"/>, если она не задана.
    /// </summary>
    internal Uri? ChangeIpUri => string.IsNullOrWhiteSpace(ChangeIpUrl) ? null : new Uri(ChangeIpUrl, UriKind.Absolute);

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        // Сообщения не повторяют значение ссылки смены IP: в ней ключ прокси.
        if (MaxIpChangeAttempts is < MinIpChangeAttempts or > MaxIpChangeAttemptsLimit)
        {
            yield return new ValidationResult(
                $"Scraping proxy max IP change attempts must be between {MinIpChangeAttempts} and {MaxIpChangeAttemptsLimit}.",
                [nameof(MaxIpChangeAttempts)]);
        }

        if (ProbeTimeout <= TimeSpan.Zero)
        {
            yield return new ValidationResult("Scraping proxy probe timeout must be positive.", [nameof(ProbeTimeout)]);
        }

        if (IpChangeDelay < MinIpChangeDelay)
        {
            yield return new ValidationResult(
                $"Scraping proxy IP change delay must be at least {MinIpChangeDelay.TotalSeconds} seconds.",
                [nameof(IpChangeDelay)]);
        }

        if (string.IsNullOrWhiteSpace(Address))
        {
            if (HasCredentials)
            {
                yield return new ValidationResult(
                    "Scraping proxy credentials require a proxy address.",
                    [nameof(Username), nameof(Password)]);
            }

            if (!string.IsNullOrWhiteSpace(ChangeIpUrl))
            {
                yield return new ValidationResult("Scraping proxy IP change link requires a proxy address.", [nameof(ChangeIpUrl)]);
            }

            yield break;
        }

        if (!string.IsNullOrWhiteSpace(ChangeIpUrl) && !IsValidChangeIpUrl(ChangeIpUrl))
        {
            yield return new ValidationResult(
                "Scraping proxy IP change link must be an absolute http:// or https:// URI.",
                [nameof(ChangeIpUrl)]);
        }

        if (!IsValidAddress(Address))
        {
            yield return new ValidationResult(
                "Scraping proxy address must be an absolute http:// URI with a host and without user info.",
                [nameof(Address)]);
        }

        if (string.IsNullOrWhiteSpace(Username) != string.IsNullOrWhiteSpace(Password))
        {
            yield return new ValidationResult(
                "Scraping proxy username and password must be set together.",
                [nameof(Username), nameof(Password)]);
        }
    }

    /// <summary>
    /// Не печатает пароль и ссылку смены IP: сгенерированный для record <c>ToString()</c> иначе выдал бы его в лог или отладчик.
    /// </summary>
    private bool PrintMembers(StringBuilder builder)
    {
        builder.Append(
            $"{nameof(Address)} = {Address}, {nameof(Username)} = {Username}, {nameof(Password)} = ***, "
            + $"{nameof(ChangeIpUrl)} = ***, {nameof(MaxIpChangeAttempts)} = {MaxIpChangeAttempts}, "
            + $"{nameof(ProbeTimeout)} = {ProbeTimeout}, {nameof(IpChangeDelay)} = {IpChangeDelay}");
        return true;
    }

    private static bool IsValidAddress([NotNullWhen(true)] string? address) =>
        Uri.TryCreate(address, UriKind.Absolute, out var uri)
        && uri.Scheme == Uri.UriSchemeHttp
        && !string.IsNullOrEmpty(uri.Host)
        && string.IsNullOrEmpty(uri.UserInfo);

    private static bool IsValidChangeIpUrl(string changeIpUrl) =>
        Uri.TryCreate(changeIpUrl, UriKind.Absolute, out var uri)
        && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps)
        && !string.IsNullOrEmpty(uri.Host);
}
