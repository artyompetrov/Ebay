using System.Globalization;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;

namespace Server.Adapters.Driven.Qrz;

/// <summary>
/// Разбор страницы списка объявлений категории qrz.ru.
/// </summary>
internal static partial class QrzListPageParser
{
    private const string AbsoluteDateFormat = "dd.MM.yyyy HH:mm";
    private const string TimeFormat = "HH:mm";
    private const string TodayPrefix = "Сегодня";
    private const string YesterdayPrefix = "Вчера";

    public static QrzListing[] Parse(string html, DateTimeOffset now, ILogger logger)
    {
        var document = new HtmlDocument();
        document.LoadHtml(html);

        var rows = document.DocumentNode.SelectNodes(
            "//div[contains(concat(' ', normalize-space(@class), ' '), ' adv_row ')]");

        if (rows is null)
        {
            return [];
        }

        var result = new List<QrzListing>(rows.Count);

        foreach (var row in rows)
        {
            var href = row.SelectSingleNode(".//span[contains(@class, 'Title')]/a")?.GetAttributeValue("href", string.Empty) ?? string.Empty;
            var dateText = HtmlEntity.DeEntitize(row.SelectSingleNode(".//span[contains(@class, 'adv_date')]")?.InnerText ?? string.Empty).Trim();

            if (!TryParseId(href, out var id))
            {
                logger.LogWarning("Skipping qrz.ru list entry without a listing link: {Href}", href);
                continue;
            }

            if (!TryParseDate(dateText, now, out var date))
            {
                logger.LogWarning("Skipping qrz.ru listing {ListingId} due to unparsable date: {Date}", id, dateText);
                continue;
            }

            result.Add(new QrzListing(id, new Uri(WellKnown.BaseUri, href), date));
        }

        return [.. result];
    }

    internal static bool TryParseDate(string text, DateTimeOffset now, out DateTimeOffset date)
    {
        var moscowToday = DateOnly.FromDateTime(now.ToOffset(WellKnown.MoscowOffset).DateTime);

        if (TryParseRelative(text, TodayPrefix, moscowToday, out date)
            || TryParseRelative(text, YesterdayPrefix, moscowToday.AddDays(-1), out date))
        {
            return true;
        }

        if (DateTime.TryParseExact(text, AbsoluteDateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out var absolute))
        {
            date = new DateTimeOffset(absolute, WellKnown.MoscowOffset);
            return true;
        }

        date = default;
        return false;
    }

    private static bool TryParseRelative(string text, string prefix, DateOnly day, out DateTimeOffset date)
    {
        date = default;

        if (!text.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)
            || !TimeOnly.TryParseExact(text[prefix.Length..].Trim(), TimeFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out var time))
        {
            return false;
        }

        date = new DateTimeOffset(day.ToDateTime(time), WellKnown.MoscowOffset);
        return true;
    }

    private static bool TryParseId(string href, out long id)
    {
        id = 0;
        var match = ListingIdRegex().Match(href);
        return match.Success && long.TryParse(match.Groups[1].Value, CultureInfo.InvariantCulture, out id);
    }

    [GeneratedRegex(@"^/classifieds/detail/[^/?#]*_(\d+)$")]
    private static partial Regex ListingIdRegex();
}
