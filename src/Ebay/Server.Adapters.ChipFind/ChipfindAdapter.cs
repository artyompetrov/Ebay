using System.Text;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using Server.Application.HostedServices.ChipFind;

namespace Server.Adapters.ChipFind;

public class ChipfindAdapter : IChipfindAdapter
{
    private readonly ILogger<ChipfindAdapter> _logger;
    private readonly IHttpClientFactory _httpClientFactory;

    public ChipfindAdapter(ILogger<ChipfindAdapter> logger, IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<IReadOnlyCollection<SaleAdvertisement>> GetRecentSaleAdvertisements(
        CancellationToken cancellationToken)
    {
        var url = "https://www.chipfind.ru/market/sale_full.xml";

        var httpClient = _httpClientFactory.CreateClient("chipfind");
        var xmlContent = await httpClient.GetStringAsync(url, cancellationToken);

        var xdoc = XDocument.Parse(xmlContent);


        var titleRegex = new Regex(@"^(.*?)[\.\s]*\[(.+?)\]\s*$");

        var result = new List<SaleAdvertisement>();

        foreach (var item in xdoc.Descendants("item"))
        {
            var titleAndSeller = item.Element("title")?.Value ?? throw new NullReferenceException("title");
            var link = item.Element("link")?.Value ?? throw new NullReferenceException("link");
            var description = item.Element("description")?.Value ?? throw new NullReferenceException("description");
            var pubDate = item.Element("pubDate")?.Value ?? throw new NullReferenceException("pubDate");

            var doc = new HtmlDocument();
            doc.LoadHtml(description);

            PreNodesAsNewLines(doc);

            var htmlWithLineBreaks = Regex.Replace(
                input: doc.DocumentNode.InnerHtml,
                pattern: @"<br\s*/?>",
                replacement: "\n",
                options: RegexOptions.IgnoreCase);

            var plainText = Regex.Replace(htmlWithLineBreaks, "<.*?>", string.Empty);
            plainText = HtmlEntity.DeEntitize(plainText);

            var items = plainText
                .Split(separator: new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(x => x.Trim())
                .Where(x => !string.IsNullOrEmpty(x))
                .ToArray();

            var matchingResult = titleRegex.Match(titleAndSeller);

            if (!matchingResult.Success) throw new InvalidOperationException("Unable to parse title");

            var title = matchingResult.Groups[1].Value.Trim();
            var seller = matchingResult.Groups[2].Value.Trim();


            if (items.Any(x => x.Length > 1000))
            {
                _logger.LogWarning("Suspicious huge items in adveritsement: {description}", description.Substring(0, 1000));
            }

            result.Add(
                new SaleAdvertisement(
                    Title: title,
                    Seller: seller.ToLower(),
                    Date: DateTime.Parse(pubDate).ToUniversalTime(),
                    Link: new Uri(link),
                    Items: items,
                    Body: description));
        }


        return result;
    }

    public async Task<string?> TryGetAdvertisementEmailAsync(Uri link, CancellationToken cancellationToken)
    {
        try
        {
            var httpClient = _httpClientFactory.CreateClient("chipfind");
            using var response = await httpClient.GetAsync(link, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Unable to fetch advertisement page {Link}. Status code: {StatusCode}", link, response.StatusCode);
                return null;
            }

            var html = await response.Content.ReadAsStringAsync(cancellationToken);
            if (string.IsNullOrWhiteSpace(html))
            {
                return null;
            }

            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            return TryExtractContactFromContactSection(doc);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse advertisement contact from {Link}", link);
            return null;
        }
    }

    private static string? TryExtractContactFromContactSection(HtmlDocument doc)
    {
        var contactNode = doc.DocumentNode.SelectSingleNode("//div[contains(concat(' ', normalize-space(@class), ' '), ' contact ')]");
        if (contactNode == null)
        {
            return null;
        }

        var builder = new StringBuilder();
        AppendPlainText(contactNode, builder);

        var plainText = HtmlEntity.DeEntitize(builder.ToString());
        plainText = Regex.Replace(plainText, "[ \t]+\n", "\n");
        plainText = Regex.Replace(plainText, "\n[ \t]+", "\n");
        plainText = Regex.Replace(plainText, "\n{2,}", "\n");
        plainText = Regex.Replace(plainText, "[ \t]{2,}", " ");
        plainText = plainText.Trim();

        return string.IsNullOrWhiteSpace(plainText) ? null : plainText;
    }

    private static void AppendPlainText(HtmlNode node, StringBuilder builder)
    {
        foreach (var child in node.ChildNodes)
        {
            switch (child.NodeType)
            {
                case HtmlNodeType.Element when child.Name.Equals("br", StringComparison.OrdinalIgnoreCase):
                    if (builder.Length > 0 && builder[^1] != '\n')
                    {
                        builder.Append('\n');
                    }
                    break;
                case HtmlNodeType.Element:
                    AppendPlainText(child, builder);
                    break;
                case HtmlNodeType.Text:
                    var text = child.InnerText;
                    if (!string.IsNullOrWhiteSpace(text))
                    {
                        if (builder.Length > 0 && !char.IsWhiteSpace(builder[^1]))
                        {
                            builder.Append(' ');
                        }

                        builder.Append(text.Trim());
                    }
                    break;
            }
        }
    }

    private static void PreNodesAsNewLines(HtmlDocument doc)
    {
        var preNodes = doc.DocumentNode.SelectNodes("//pre");
        if (preNodes != null)
        {
            foreach (var pre in preNodes)
            {
                // Создаём текстовый узел
                var textNode = doc.CreateTextNode(pre.InnerText.Trim());

                // Создаём <br>
                var brNode = doc.CreateElement("br");

                // Вставляем перед <pre>
                pre.ParentNode.InsertBefore(textNode, pre);
                pre.ParentNode.InsertBefore(brNode, pre);

                // Удаляем сам <pre>
                pre.Remove();
            }
        }
    }
}