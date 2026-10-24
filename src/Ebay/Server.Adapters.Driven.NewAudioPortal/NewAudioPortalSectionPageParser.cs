using System.Globalization;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using OneOf;
using OneOf.Types;

namespace Server.Adapters.Driven.NewAudioPortal;

/// <summary>
/// Разбор первой страницы раздела форума (Invision Community): темы в порядке последней активности.
/// </summary>
internal static partial class NewAudioPortalSectionPageParser
{
    /// <summary>
    /// Возвращает темы страницы; <see cref="Error{T}"/>, если на странице нет списка тем (заглушка файрвола, капча,
    /// изменённая разметка), чтобы такая страница не выглядела как раздел без тем.
    /// </summary>
    public static OneOf<NewAudioPortalTopicRow[], Error<string>> Parse(string html, ILogger logger)
    {
        var document = new HtmlDocument();
        document.LoadHtml(html);

        // HtmlAgilityPack хранит имена атрибутов в нижнем регистре: data-tableID -> data-tableid.
        var topicList = document.DocumentNode.SelectSingleNode("//*[@data-tableid='topics']");

        if (topicList is null)
        {
            return new Error<string>("newaudioportal.com section page has no topic list");
        }

        var rows = topicList.SelectNodes(".//li[@data-rowid]");

        if (rows is null)
        {
            return Array.Empty<NewAudioPortalTopicRow>();
        }

        var result = new List<NewAudioPortalTopicRow>(rows.Count);

        foreach (var row in rows)
        {
            var rowId = row.GetAttributeValue("data-rowid", string.Empty);
            var href = HtmlEntity.DeEntitize(
                row.SelectSingleNode(".//h4[contains(@class, 'ipsDataItem_title')]//a[contains(@href, '/topic/')]")?.GetAttributeValue("href", string.Empty)
                ?? string.Empty);
            var lastPostText = row.SelectSingleNode(".//*[contains(@class, 'ipsDataItem_lastPoster')]//time[@datetime]")?.GetAttributeValue("datetime", string.Empty)
                ?? string.Empty;

            if (!long.TryParse(rowId, NumberStyles.None, CultureInfo.InvariantCulture, out var id))
            {
                logger.LogWarning("Skipping newaudioportal.com topic row with unparsable id: {RowId}", rowId);
                continue;
            }

            if (!TopicPathRegex().IsMatch(href) || !Uri.TryCreate(WellKnown.BaseUri, href, out var link))
            {
                logger.LogWarning("Skipping newaudioportal.com topic {TopicId} without a topic link: {Href}", id, href);
                continue;
            }

            if (!TryParseTime(lastPostText, out var lastPostDate))
            {
                logger.LogWarning("Skipping newaudioportal.com topic {TopicId} due to unparsable last post time: {LastPost}", id, lastPostText);
                continue;
            }

            result.Add(new NewAudioPortalTopicRow(id, link, lastPostDate));
        }

        return result.ToArray();
    }

    /// <summary>
    /// Машиночитаемое время Invision (<c>2026-10-24T14:35:21Z</c>) в UTC.
    /// </summary>
    internal static bool TryParseTime(string text, out DateTimeOffset date) =>
        DateTimeOffset.TryParse(
            text,
            CultureInfo.InvariantCulture,
            DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
            out date)
        && text.Length > 0;

    [GeneratedRegex(@"/topic/\d+")]
    private static partial Regex TopicPathRegex();
}
