using System.Text.RegularExpressions;
using System.Xml.Linq;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using Server.Application.HostedServices.ChipFind;

namespace Server.Adapters.ChipFind;

public class ChipfindAdapter : IChipfindAdapter
{
    private readonly ILogger<ChipfindAdapter> _logger;

    public ChipfindAdapter(ILogger<ChipfindAdapter> logger)
    {
        _logger = logger;
    }

    public async Task<IReadOnlyCollection<SaleAdvertisement>> GetRecentSaleAdvertisements(
        CancellationToken cancellationToken)
    {
        var url = "https://www.chipfind.ru/market/sale_full.xml";

        using var httpClient = new HttpClient();
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

            var plainText = Regex.Replace(
                input: doc.DocumentNode.InnerText,
                pattern: @"<br\s*/?>",
                replacement: "\n",
                options: RegexOptions.IgnoreCase);

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
                _logger.LogWarning("Suspicious huge items in adveritsement: {description}", description.Substring(0,1000));
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