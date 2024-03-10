using System.Net.Http.Headers;
using Ebay.Server;
using Ebay.Client.Clients.Generated;
using Ebay.Server.Infrastructure;
using Ebay.Server.Services;
using Newtonsoft.Json.Linq;

namespace Tests;

[Explicit]
public class ExplicitTests
{
    public EbayClient _client = null!;

    [OneTimeSetUp]
    public async Task Setup()
    {
        await CreateClient();
    }

    private async Task CreateClient()
    {
        var server = "naks42.ru";
        var port = 17443;
        var baseAddress = $"https://{server}:{port}";

        var url = $"{baseAddress}/connect/token";
        var httpClient = new HttpClient();

        using var res = await httpClient.SendAsync(
            new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new FormUrlEncodedContent(
                    new List<KeyValuePair<string, string>>
                    {
                        new("grant_type", "client_credentials"),
                        new("client_id", WellKnown.Authorization.ClientId),
                        new("client_secret", WellKnown.Authorization.AuthToken),
                    }
                )
            }
        );

        var token = JToken.Parse(await res.Content.ReadAsStringAsync())["access_token"]!.ToString();

        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        _client = new EbayClient(httpClient) { BaseUrl = baseAddress + "/api/ebay/v1" };
    }

    [Test]
    public async Task Check_Extractor_Functions()
    {
        //у этих продавцов встречаются лоты, что не получается распознать
        var excludeSellers = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "sarmat1968"
        };

       var allProducts = await _client.GetAllProductsAsync();
       var lotNumber = 0;
       foreach (var product in allProducts)
       {
           //if (product.Id != Guid.Parse("56037ebe-d27d-454c-88ae-669475c5e9f7")) continue;
           
           var info = await _client.GetLotsAsync(product.Id);

           foreach (var lotInfoShort in info)
           {
               //if (lotInfoShort.LotId != 364647356108) continue;

               if (excludeSellers.Contains(lotInfoShort.Seller)) continue;

               var lotInfoFull = await _client.GetLotInfoAsync(lotInfoShort.LotId);

               var result = ManualFieldsExtractor.ExtractCount(
                   lotInfoShort.Name,
                   lotInfoShort.ConditionDescription,
                   lotInfoFull.LotInfo.Description
               );

               var isExtractedCorrectly = (lotInfoShort.Pcs == 1 && result.Count == 0) || (result.Count >= 1 &&
                   result.OrderByDescending(x => x.Value.Count).First().Key == lotInfoShort.Pcs);

               Assert.That(
                   isExtractedCorrectly,
                   $"product: {product.Id}, lotId: {lotInfoShort.LotId}, " +
                   $"seller: {lotInfoShort.Seller}, lotNumber: {lotNumber}, result: {Environment.NewLine}{ToStr(result)}"
               );

               lotNumber++;
           }
       }
    }

    private string ToStr(Dictionary<int, HashSet<ManualFieldsExtractor.ExtractionResult>> result)
    {
        return string.Join(
            Environment.NewLine,
            result.Select(x => $"Count {x.Key}, Values: {string.Join(Environment.NewLine + "\t\t\t\t", x.Value.Select(x => x.ToString()))}")
        );

    }
}