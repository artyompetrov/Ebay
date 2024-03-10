using System.Net.Http.Headers;
using Ebay.Server;
using Ebay.Client.Clients.Generated;
using Ebay.Server.Services;
using Newtonsoft.Json.Linq;
using LotDataToExtract = Ebay.Server.Controllers.Generated.LotDataToExtract;

namespace Tests;

[Explicit]
public class ExplicitTests
{
    private static readonly EbayClient Client = CreateClient();
    
    private static EbayClient CreateClient()
    {
        var server = "naks42.ru";
        var port = 17443;
        var baseAddress = $"https://{server}:{port}";

        var url = $"{baseAddress}/connect/token";
        var httpClient = new HttpClient();

        using var res = httpClient.SendAsync(
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
        ).GetAwaiter().GetResult();

        var token = JToken.Parse(res.Content.ReadAsStringAsync().GetAwaiter().GetResult())["access_token"]!.ToString();

        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        return new EbayClient(httpClient) { BaseUrl = baseAddress + "/api/ebay/v1" };
    }

    [TestCaseSource(nameof(GetLots))]
    public async Task Check_Extractor_Function_Pcs(long lotId)
    {
        var lotInfoFull = await Client.GetLotInfoAsync(lotId);
        
        var extractedFields = ManualFieldsExtractor.ExtractCount(new LotDataToExtract(
            conditionDescription: lotInfoFull.LotInfo.ConditionDescription,
            description: lotInfoFull.LotInfo.Description,
            name: lotInfoFull.LotInfo.Name));

        var result = extractedFields["pcs"];

        var isExtractedCorrectly = (lotInfoFull.LotInfo.Pcs == 1 && result.Count == 0) || (extractedFields.Count >= 1 &&
            int.Parse(
                result.MaxBy(x => x.Value.Count).Key
            ) == lotInfoFull.LotInfo.Pcs);

        Assert.That(
            condition: isExtractedCorrectly,
            message: ToStr(result)
        );
    }
 
    [TestCaseSource(nameof(GetLots))]
    public async Task Check_Extractor_Function_Condition(long lotId)
    {
        var lotInfoFull = await Client.GetLotInfoAsync(lotId);
        
        var extractedFields = ManualFieldsExtractor.ExtractCount(new LotDataToExtract(
            conditionDescription: lotInfoFull.LotInfo.ConditionDescription,
            description: lotInfoFull.LotInfo.Description,
            name: lotInfoFull.LotInfo.Name));

        var result = extractedFields["condition"];

        var isExtractedCorrectly = result.Keys.Count > 0;

        Assert.That(
            condition: isExtractedCorrectly,
            message: ToStr(result)
        );
    }
    

    public static IEnumerable<TestCaseData> GetLots()
    {
        // список неподдерживаемых лотов
        var excludedLots = new HashSet<long>
        {
        };

        var allLotIds = Client.GetLotIdsAsync().GetAwaiter().GetResult();

        foreach (var lotId in allLotIds)
        {
            if ( excludedLots.Contains(lotId)) continue;

            yield return new TestCaseData(lotId)
            {
                TestName = $"{lotId}"
            };
        }
    }
    
    private static string ToStr(Dictionary<string, HashSet<ExtractionResult>> result)
    {
        return string.Join(
            Environment.NewLine,
            result.Select(x => $"Count {x.Key}, Values: {string.Join(Environment.NewLine + "\t\t\t\t", x.Value.Select(x => x.ToString()))}")
        );

    }
}