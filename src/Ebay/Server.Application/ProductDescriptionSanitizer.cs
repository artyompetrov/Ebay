using Ganss.Xss;

namespace Server.Application;

/// <summary>
/// Санитайзер HTML-описания товара для безопасного отображения в листинге eBay.
/// </summary>
public sealed class ProductDescriptionSanitizer
{
    private static readonly string[] AllowedTags =
    [
        "p", "br", "b", "strong", "i", "em", "u", "s",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "ul", "ol", "li", "a", "img", "span", "div", "blockquote"
    ];

    private static readonly string[] AllowedAttributes = ["href", "src", "alt"];

    private static readonly string[] AllowedSchemes = ["http", "https"];

    private readonly HtmlSanitizer _sanitizer;

    /// <summary>
    /// Создает санитайзер с допустимым набором тегов и атрибутов форматирования описания товара.
    /// </summary>
    public ProductDescriptionSanitizer()
    {
        _sanitizer = new HtmlSanitizer();

        _sanitizer.AllowedTags.Clear();
        foreach (var tag in AllowedTags)
        {
            _sanitizer.AllowedTags.Add(tag);
        }

        _sanitizer.AllowedAttributes.Clear();
        foreach (var attribute in AllowedAttributes)
        {
            _sanitizer.AllowedAttributes.Add(attribute);
        }

        _sanitizer.AllowedSchemes.Clear();
        foreach (var scheme in AllowedSchemes)
        {
            _sanitizer.AllowedSchemes.Add(scheme);
        }
    }

    /// <summary>
    /// Очищает HTML описания товара от потенциально опасной разметки, оставляя допустимый набор форматирования.
    /// Возвращает <see langword="null" />, если после очистки описание пусто.
    /// </summary>
    public string? Sanitize(string? descriptionHtml)
    {
        if (string.IsNullOrWhiteSpace(descriptionHtml))
        {
            return null;
        }

        var sanitized = _sanitizer.Sanitize(descriptionHtml);

        return string.IsNullOrWhiteSpace(sanitized) ? null : sanitized;
    }
}
