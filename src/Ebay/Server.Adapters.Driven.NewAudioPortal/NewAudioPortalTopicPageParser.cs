using System.Globalization;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using OneOf;
using OneOf.Types;

namespace Server.Adapters.Driven.NewAudioPortal;

/// <summary>
/// Разбор страницы темы форума (Invision Community): заголовок, число страниц и сообщения с авторами и строками.
/// </summary>
internal static partial class NewAudioPortalTopicPageParser
{
    private const int SinglePage = 1;

    /// <summary>
    /// Возвращает страницу темы; <see cref="Error{T}"/>, если на странице нет заголовка или сообщений (заглушка
    /// файрвола, капча, изменённая разметка): такую страницу нельзя считать прочитанной темой.
    /// </summary>
    public static OneOf<NewAudioPortalTopicPage, Error<string>> Parse(string html, ILogger logger)
    {
        var document = new HtmlDocument();
        document.LoadHtml(html);
        var root = document.DocumentNode;

        var title = ToText(root.SelectSingleNode("//h1[contains(@class, 'ipsType_pageTitle')]")?.InnerText ?? string.Empty);

        if (title.Length == 0)
        {
            return new Error<string>("newaudioportal.com topic page has no title");
        }

        // Только лента сообщений: блок рекомендованных ответов перед ней тоже состоит из article.
        var articles = root.SelectNodes("//*[@data-role='commentFeed']//article[starts-with(@id, 'elComment_')]");

        if (articles is null)
        {
            return new Error<string>("newaudioportal.com topic page has no posts");
        }

        var posts = new List<NewAudioPortalPost>(articles.Count);

        foreach (var article in articles)
        {
            var timeText = article.SelectSingleNode(".//*[contains(@class, 'ipsComment_meta')]//time[@datetime]")?.GetAttributeValue("datetime", string.Empty)
                ?? string.Empty;

            if (!NewAudioPortalSectionPageParser.TryParseTime(timeText, out var date))
            {
                // Первое сообщение первой страницы - шапка, по нему определяется продавец: без него автором стал бы
                // кто-то из ответивших. Такую страницу не считаем прочитанной.
                if (posts.Count == 0)
                {
                    return new Error<string>($"newaudioportal.com post {article.Id} opening the page has unparsable time: {timeText}");
                }

                logger.LogWarning("Skipping newaudioportal.com post {PostId} due to unparsable time: {Time}", article.Id, timeText);
                continue;
            }

            posts.Add(new NewAudioPortalPost(ParseAuthor(article), date, ParseLines(article)));
        }

        var pagesText = root.SelectSingleNode("//*[@data-ipspagination-pages]")?.GetAttributeValue("data-ipspagination-pages", string.Empty);
        var pageCount = int.TryParse(pagesText, NumberStyles.None, CultureInfo.InvariantCulture, out var pages) && pages > SinglePage
            ? pages
            : SinglePage;

        return new NewAudioPortalTopicPage(title, pageCount, [.. posts]);
    }

    private static NewAudioPortalAuthor? ParseAuthor(HtmlNode article)
    {
        var link = article.SelectSingleNode(".//*[contains(@class, 'cAuthorPane_author')]//a[contains(@href, '/profile/')]");
        var match = ProfileIdRegex().Match(link?.GetAttributeValue("href", string.Empty) ?? string.Empty);

        return link is null || !match.Success
            ? null
            : new NewAudioPortalAuthor(match.Groups[1].Value, ToText(link.InnerText));
    }

    private static string[] ParseLines(HtmlNode article)
    {
        var content = article.SelectSingleNode(".//*[@data-role='commentContent']");

        if (content is null)
        {
            return [];
        }

        // Работаем с копией, чтобы не менять документ: цитаты чужих сообщений и пометки о редактировании - не текст автора.
        var body = content.CloneNode(deep: true);

        foreach (var excluded in body.SelectNodes(".//blockquote | .//*[@data-excludequote]")?.ToArray() ?? [])
        {
            excluded.Remove();
        }

        return ToLines(body.InnerHtml);
    }

    // TODO: разбивка HTML на строки (br -> перевод строки, снятие тегов, DeEntitize) повторяется в ChipFind и Qrz;
    // вынести общий помощник, когда появится общий проект утилит для адаптеров-парсеров.
    private static string[] ToLines(string innerHtml)
    {
        var withLineBreaks = LineBreakRegex().Replace(innerHtml, "\n");
        var plainText = HtmlEntity.DeEntitize(TagRegex().Replace(withLineBreaks, string.Empty));

        return plainText
            .Split(['\r', '\n'], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Where(static x => x.Length > 0)
            .ToArray();
    }

    private static string ToText(string html) => WhitespaceRegex().Replace(HtmlEntity.DeEntitize(html), " ").Trim();

    // Перевод строки, концы блочных элементов и ячеек таблиц: строки не должны зависеть от переводов строк в исходном HTML.
    [GeneratedRegex(@"<br\s*/?>|</(?:p|div|li|h[1-6]|tr|td|th)\s*>", RegexOptions.IgnoreCase)]
    private static partial Regex LineBreakRegex();

    [GeneratedRegex(@"\s+")]
    private static partial Regex WhitespaceRegex();

    [GeneratedRegex("<.*?>", RegexOptions.Singleline)]
    private static partial Regex TagRegex();

    [GeneratedRegex(@"/profile/(\d+)-")]
    private static partial Regex ProfileIdRegex();
}
