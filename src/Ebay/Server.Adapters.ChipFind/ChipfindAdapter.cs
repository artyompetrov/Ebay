using System.Text.RegularExpressions;
using System.Xml.Linq;
using HtmlAgilityPack;
using Server.HostedServices.ChipFind;

namespace Server.Adapters.ChipFind;

public class ChipfindAdapter : IChipfindAdapter
{

    public async Task<IReadOnlyCollection<SaleAdvertisement>> GetRecentSaleAdvertisements(CancellationToken cancellationToken)
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

            var plainText = doc.DocumentNode.InnerText;

            var items = plainText
                .Split(separator: ['\r', '\n'], StringSplitOptions.RemoveEmptyEntries)
                .Select(x => x.Trim())
                .Where(x => !string.IsNullOrEmpty(x))
                .ToArray();

            var matchingResult = titleRegex.Match(titleAndSeller);

            if (!matchingResult.Success) throw new InvalidOperationException("Unable to parse title");

            var title = matchingResult.Groups[1].Value.Trim();
            var seller = matchingResult.Groups[2].Value.Trim();

            result.Add(
                new SaleAdvertisement(
                    Title: title,
                    Seller: seller,
                    Date: DateTime.Parse(pubDate).ToUniversalTime(),
                    Link: new Uri(link),
                    Items: items));
        }


        return result;
    }
}