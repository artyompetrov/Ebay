using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.Qrz;

/// <summary>
/// Разбор страницы объявления qrz.ru: заголовок, строки описания и автор.
/// </summary>
internal static partial class QrzListingPageParser
{
    private const string UserProfilePrefix = "/user/";
    private const string AuthorLabel = "Автор:";

    public static SaleAdvertisement? TryParse(string html, QrzListing listing, ILogger logger)
    {
        var document = new HtmlDocument();
        document.LoadHtml(html);
        var root = document.DocumentNode;

        var author = root.SelectSingleNode("//div[contains(@class, 'adv_settings')]");
        var profileHref = author?.SelectSingleNode($".//a[starts-with(@href, '{UserProfilePrefix}')]")?.GetAttributeValue("href", string.Empty) ?? string.Empty;
        var sellerKey = profileHref.Length > UserProfilePrefix.Length ? profileHref[UserProfilePrefix.Length..].Trim('/') : string.Empty;

        if (author is null || sellerKey.Length == 0)
        {
            logger.LogWarning("Skipping qrz.ru listing {ListingId}: no author profile link", listing.Id);
            return null;
        }

        var title = ToText(root.SelectSingleNode("//h1")?.InnerText ?? string.Empty);
        var descriptionLines = root.SelectNodes("//div[contains(@class, 'classified_full_body')]/div/p")?
            .SelectMany(static x => ToLines(x.InnerHtml))
            ?? [];
        var sellerName = ParseSellerName(author);

        return new SaleAdvertisement(
            Title: title,
            SellerKey: sellerKey,
            SellerName: sellerName.Length > 0 ? sellerName : sellerKey,
            Date: listing.Date,
            Link: listing.Link,
            Items: [.. new[] { title }.Concat(descriptionLines).Where(static x => x.Length > 0)]);
    }

    public static Uri GetProfileUri(string sellerKey) => new(WellKnown.BaseUri, $"{UserProfilePrefix.TrimStart('/')}{sellerKey}");

    private static string ParseSellerName(HtmlNode author)
    {
        // <strong>Автор:</strong> Евгений Смирнов (организация).<br>
        var label = author.SelectSingleNode($".//strong[normalize-space(text())='{AuthorLabel}']");
        var name = ToText(label?.NextSibling?.InnerText ?? string.Empty).TrimEnd('.');
        return ParenthesizedSuffixRegex().Replace(name, string.Empty).Trim();
    }

    private static IEnumerable<string> ToLines(string innerHtml)
    {
        var withLineBreaks = LineBreakRegex().Replace(innerHtml, "\n");
        var plainText = HtmlEntity.DeEntitize(TagRegex().Replace(withLineBreaks, string.Empty));

        return plainText
            .Split(['\r', '\n'], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Where(static x => x.Length > 0);
    }

    private static string ToText(string html) => HtmlEntity.DeEntitize(html).Trim();

    [GeneratedRegex(@"<br\s*/?>", RegexOptions.IgnoreCase)]
    private static partial Regex LineBreakRegex();

    [GeneratedRegex("<.*?>")]
    private static partial Regex TagRegex();

    [GeneratedRegex(@"\s*\([^)]*\)\s*$")]
    private static partial Regex ParenthesizedSuffixRegex();
}
