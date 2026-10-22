using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Text;

namespace Server.Adapters.Driven.ScrapingProxy;

/// <summary>
/// HTTP-прокси для адаптеров, которые парсят сторонние сайты (qrz.ru, chipfind.ru), чтобы не светить им IP сервера.
/// Переменные окружения <c>ScrapingProxy__Address</c>, <c>ScrapingProxy__Username</c>, <c>ScrapingProxy__Password</c>.
/// Пустой адрес означает прямое подключение.
/// </summary>
internal sealed record ScrapingProxyOptions : IValidatableObject
{
    public const string SectionName = "ScrapingProxy";

    /// <summary>
    /// Адрес прокси, абсолютный <c>http://host:port</c> без логина и пароля внутри.
    /// </summary>
    public string? Address { get; init; }

    public string? Username { get; init; }

    public string? Password { get; init; }

    internal bool HasCredentials => !string.IsNullOrWhiteSpace(Username) || !string.IsNullOrWhiteSpace(Password);

    /// <summary>
    /// Разобранный адрес прокси или <see langword="null"/>, если прокси не задан.
    /// </summary>
    internal Uri? AddressUri => string.IsNullOrWhiteSpace(Address) ? null : new Uri(Address, UriKind.Absolute);

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (string.IsNullOrWhiteSpace(Address))
        {
            if (HasCredentials)
            {
                yield return new ValidationResult(
                    "Scraping proxy credentials require a proxy address.",
                    [nameof(Username), nameof(Password)]);
            }

            yield break;
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
    /// Не печатает пароль: сгенерированный для record <c>ToString()</c> иначе выдал бы его в лог или отладчик.
    /// </summary>
    private bool PrintMembers(StringBuilder builder)
    {
        builder.Append($"{nameof(Address)} = {Address}, {nameof(Username)} = {Username}, {nameof(Password)} = ***");
        return true;
    }

    private static bool IsValidAddress([NotNullWhen(true)] string? address) =>
        Uri.TryCreate(address, UriKind.Absolute, out var uri)
        && uri.Scheme == Uri.UriSchemeHttp
        && !string.IsNullOrEmpty(uri.Host)
        && string.IsNullOrEmpty(uri.UserInfo);
}
