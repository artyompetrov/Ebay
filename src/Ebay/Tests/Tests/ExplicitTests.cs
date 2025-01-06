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
        var server = "tubes.com.ru";
        var port = 10001;
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
                            new("client_id", WellKnown.Authorization.PythonClientId),
                            new("client_secret", WellKnown.Authorization.AuthToken),
                        }
                    )
                }
            )
            .GetAwaiter()
            .GetResult();

        var token = JToken.Parse(res.Content.ReadAsStringAsync().GetAwaiter().GetResult())["access_token"]!.ToString();

        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        return new EbayClient(httpClient) { BaseUrl = baseAddress + "/api/ebay/v1" };
    }

    private static readonly HashSet<long> ExcludedLotIdsPcs = new()
    {
        115990989605,
        134932685272
    };

    [TestCaseSource(nameof(GetLots))]
    public async Task Check_Extractor_Function_Pcs(long lotId)
    {
        var lotInfoFull = await Client.GetLotInfoAsync(lotId);

        if (ExcludedLotIdsPcs.Contains(lotId)) return;
        if (lotInfoFull.IsIgnored) return;

        var extractedFields = ManualFieldsExtractor.ExtractManualData(
            new LotDataToExtract(
                conditionDescription: lotInfoFull.LotInfoWithProductId.LotInfo.ConditionDescription,
                description: lotInfoFull.LotInfoWithProductId.LotInfo.Description,
                condition: lotInfoFull.LotInfoWithProductId.LotInfo.Condition,
                name: lotInfoFull.LotInfoWithProductId.LotInfo.Name,
                shortDescription: lotInfoFull.LotInfoWithProductId.LotInfo.ShortDescription,
                lotSize: lotInfoFull.LotInfoWithProductId.LotInfo.LotSize
            )
        );

        var result = extractedFields["pcs"];

        var isExtractedCorrectly = (lotInfoFull.LotInfoWithProductId.LotInfo.Pcs == 1 && result.Count == 0) || (extractedFields.Count >= 1 &&
            int.Parse(
                result.MaxBy(x => x.Value.Count).Key
            ) == lotInfoFull.LotInfoWithProductId.LotInfo.Pcs); //todo недостаточно точная проверка

        Assert.That(
            condition: isExtractedCorrectly,
            message: $"{ToStr(result)}{Environment.NewLine}lotId: {lotId}{Environment.NewLine}seller:{lotInfoFull.LotInfoWithProductId.LotInfo.Seller}"
        );
    }

    private static readonly HashSet<long> ExcludedLotIdsCondition = new()
    {
        115600325335,
        155061500445,
        155190093237,
        155628872803,
        162171498944,
        166490092743,
        256363775925,
        254582883069,
        256256173901,
        314895518427,
        364637278865,
        364644537967,
        364675778206,
        386676163668,
        115331262735,
        194819101247,
        225657281140
    };

    [TestCaseSource(nameof(GetLots))]
    public async Task Check_Extractor_Function_Condition(long lotId)
    {
        var lotInfoFull = await Client.GetLotInfoAsync(lotId);

        if (ExcludedLotIdsCondition.Contains(lotId)) return;
        if (lotInfoFull.IsIgnored) return;

        var extractedFields = ManualFieldsExtractor.ExtractManualData(
            new LotDataToExtract(
                conditionDescription: lotInfoFull.LotInfoWithProductId.LotInfo.ConditionDescription,
                condition: lotInfoFull.LotInfoWithProductId.LotInfo.Condition,
                description: lotInfoFull.LotInfoWithProductId.LotInfo.Description,
                name: lotInfoFull.LotInfoWithProductId.LotInfo.Name,
                shortDescription: lotInfoFull.LotInfoWithProductId.LotInfo.ShortDescription,
                lotSize: lotInfoFull.LotInfoWithProductId.LotInfo.LotSize
            )
        );

        var result = extractedFields["condition"];

        var results = result.OrderByDescending(x => x.Value.Count).ToList();
        var manualCondition = lotInfoFull.LotInfoWithProductId.LotInfo.Categories.Single(x => x.Type == "condition").Value ??
            throw new AssertionException("manualCondition not found");

        Assert.That(
            condition: (results.Count == 0 && manualCondition == WellKnown.Categories.Conditions.New) ||
            (results.Count == 1 && results[0].Key.Equals(manualCondition)) ||
                (results.Count > 1 && results[0].Value.Count > results[1].Value.Count &&
                    results[0].Key.Equals(manualCondition)),
            message: $"{ToStr(result)}{Environment.NewLine}lotId: {lotId}{Environment.NewLine}seller:{lotInfoFull.LotInfoWithProductId.LotInfo.Seller}"
        );
    }


    private static readonly HashSet<long> ExcludedLotIdsState = new()
    {
        133475288040,
        115507419319,
        134725931500,
        115993741586,
        126212251918


    };

    [TestCaseSource(nameof(GetLots))]
    public async Task Check_Extractor_Function_TestState(long lotId)
    {
        var lotInfoFull = await Client.GetLotInfoAsync(lotId);

        if (ExcludedLotIdsState.Contains(lotId)) return;
        if (lotInfoFull.IsIgnored) return;

        var extractedFields = ManualFieldsExtractor.ExtractManualData(
            new LotDataToExtract(
                conditionDescription: lotInfoFull.LotInfoWithProductId.LotInfo.ConditionDescription,
                condition: lotInfoFull.LotInfoWithProductId.LotInfo.Condition,
                description: lotInfoFull.LotInfoWithProductId.LotInfo.Description,
                name: lotInfoFull.LotInfoWithProductId.LotInfo.Name,
                shortDescription: lotInfoFull.LotInfoWithProductId.LotInfo.ShortDescription,
                lotSize: lotInfoFull.LotInfoWithProductId.LotInfo.LotSize
            )
        );

        var result = extractedFields["test_state"];

        var results = result.OrderByDescending(x => x.Value.Count).ToList();
        var manualCondition = lotInfoFull.LotInfoWithProductId.LotInfo.Categories.Single(x => x.Type == "test_state").Value ??
            throw new AssertionException("testState not found");

        Assert.That(
            condition: (results.Count == 0 && manualCondition == WellKnown.Categories.TestState.NotTested) ||
            (results.Count == 1 && results[0].Key.Equals(manualCondition)) ||
            (results.Count > 1 && results[0].Value.Count > results[1].Value.Count &&
                results[0].Key.Equals(manualCondition)),
            message: $"{ToStr(result)}{Environment.NewLine}lotId: {lotId}{Environment.NewLine}seller:{lotInfoFull.LotInfoWithProductId.LotInfo.Seller}"
        );
    }


    public static IEnumerable<TestCaseData> GetLots()
    {
        var allLotIds = Client.GetLotIdsAsync().GetAwaiter().GetResult();

        foreach (var lotId in allLotIds)
        {
            yield return new TestCaseData(lotId)
            {
                TestName = $"{lotId}"
            };
        }
    }

    private static string ToStr(Dictionary<string, HashSet<ExtractionResult>> result)
    {
        if (result.Count == 0) return "Empty result";

        return string.Join(
            separator: Environment.NewLine,
            result.Select(
                x =>
                    $"Count {x.Key}, Values: {string.Join(Environment.NewLine + "\t\t\t\t", x.Value.Select(x => x.ToString()))}"
            )
        );
    }
}