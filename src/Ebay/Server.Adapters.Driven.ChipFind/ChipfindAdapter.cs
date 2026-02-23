using System.Globalization;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using HtmlAgilityPack;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Server.Application.HostedServices.ChipFind;

namespace Server.Adapters.Driven.ChipFind;

public class ChipfindAdapter : IChipfindAdapter
{
    private readonly ILogger<ChipfindAdapter> _logger;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMemoryCache _memoryCache;
    private readonly ChipFindAdapterOptions _options;

    public ChipfindAdapter(
        ILogger<ChipfindAdapter> logger,
        IHttpClientFactory httpClientFactory,
        IMemoryCache memoryCache,
        ChipFindAdapterOptions options)
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;
        _memoryCache = memoryCache;
        _options = options;
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
            var titleAndSeller = item.Element("title")?.Value;
            var link = item.Element("link")?.Value;
            var description = item.Element("description")?.Value;
            var pubDate = item.Element("pubDate")?.Value;

            if (string.IsNullOrWhiteSpace(titleAndSeller)
                || string.IsNullOrWhiteSpace(link)
                || string.IsNullOrWhiteSpace(description)
                || string.IsNullOrWhiteSpace(pubDate))
            {
                _logger.LogWarning("Skipping chipfind advertisement due to missing required fields");
                continue;
            }

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
                .Split(separator: ['\r', '\n'], StringSplitOptions.RemoveEmptyEntries)
                .Select(x => x.Trim())
                .Where(x => !string.IsNullOrEmpty(x))
                .ToArray();

            var matchingResult = titleRegex.Match(titleAndSeller);

            if (!matchingResult.Success)
            {
                _logger.LogWarning("Skipping chipfind advertisement due to invalid title format: {Title}", titleAndSeller);
                continue;
            }

            var title = matchingResult.Groups[1].Value.Trim();
            var seller = matchingResult.Groups[2].Value.Trim();


            if (items.Any(x => x.Length > 1000))
            {
                _logger.LogWarning("Suspicious huge items in advertisement: {Description}", description[..1000]);
            }


            if (!DateTime.TryParse(pubDate, CultureInfo.InvariantCulture, DateTimeStyles.AllowWhiteSpaces, out var parsedDate))
            {
                _logger.LogWarning("Skipping chipfind advertisement due to invalid publication date: {PubDate}", pubDate);
                continue;
            }

            if (!Uri.TryCreate(link, UriKind.Absolute, out var advertisementLink))
            {
                _logger.LogWarning("Skipping chipfind advertisement due to invalid link: {Link}", link);
                continue;
            }

            result.Add(
                new SaleAdvertisement(
                    Title: title,
                    Seller: seller.ToLower(CultureInfo.InvariantCulture),
                    Date: parsedDate.ToUniversalTime(),
                    Link: advertisementLink,
                    Items: items,
                    Body: description));
        }


        return result;
    }

    public async Task<string?> TryGetAdvertisementContactAsync(SaleAdvertisement saleAdvertisement, CancellationToken cancellationToken)
    {
        var cacheKey = $"seller_contact_information_{saleAdvertisement.Seller}";

        if (_memoryCache.TryGetValue<string?>(cacheKey, out var contact))
        {
            return contact;
        }

        try
        {
            var httpClient = _httpClientFactory.CreateClient("chipfind");
            using var response = await httpClient.GetAsync(saleAdvertisement.Link, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Unable to fetch advertisement page {Link}. Status code: {StatusCode}", saleAdvertisement.Link, response.StatusCode);
                return null;
            }

            var html = await response.Content.ReadAsStringAsync(cancellationToken);
            if (string.IsNullOrWhiteSpace(html))
            {
                return null;
            }

            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var result = TryExtractContactFromContactSection(doc);

            _ = _memoryCache.Set(cacheKey, result);

            await Task.Delay(_options.DelayMilliseconds, cancellationToken);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse advertisement contact from {Link}", saleAdvertisement.Link);
            return null;
        }
    }

    private static string? TryExtractContactFromContactSection(HtmlDocument doc)
    {
        var contactNode = doc.DocumentNode.Descendants("div")
            .FirstOrDefault(d => d.GetClasses().Contains("contact"));

        return contactNode?.InnerText;
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
                _ = pre.ParentNode.InsertBefore(textNode, pre);
                _ = pre.ParentNode.InsertBefore(brNode, pre);

                // Удаляем сам <pre>
                pre.Remove();
            }
        }
    }
}