using System.Globalization;
using Server.Application;
using Server.Application.Services.LotDataExtractor;
using LotDataToExtract = Server.Controllers.Generated.LotDataToExtract;

namespace Tests
{
    [Category("ExplicitOnly")]
    [Explicit]
    [NonParallelizable]
    public class LotsExplicitTests : ExplicitTestsBase
    {
        private static readonly HashSet<long> ExcludedLotIdsPcs =
        [
            115990989605,
            134932685272
        ];

        [TestCaseSource(nameof(GetLots))]
        public async Task Check_Extractor_Function_Pcs(long lotId)
        {
            var lotInfoFull = await BackendClient.GetLotInfoAsync(lotId);

            if (ExcludedLotIdsPcs.Contains(lotId))
            {
                return;
            }

            var extractedFields = ManualFieldsExtractor.ExtractManualData(
                new LotDataToExtract(
                    conditionDescription: lotInfoFull.LotInfo.ConditionDescription,
                    description: lotInfoFull.LotInfo.Description,
                    condition: lotInfoFull.LotInfo.Condition,
                    name: lotInfoFull.LotInfo.Name,
                    shortDescription: lotInfoFull.LotInfo.ShortDescription,
                    lotSize: lotInfoFull.LotInfo.LotSize
                )
            );

            var result = extractedFields["pcs"];

            var isExtractedCorrectly = lotInfoFull.LotInfo.Pcs == 1 && result.Count == 0 || extractedFields.Count >= 1 &&
                int.Parse(
                    result.MaxBy(x => x.Value.Count).Key
                , CultureInfo.InvariantCulture) == lotInfoFull.LotInfo.Pcs; //todo недостаточно точная проверка

            Assert.That(
                condition: isExtractedCorrectly,
                message: $"{ToStr(result)}{Environment.NewLine}lotId: {lotId}{Environment.NewLine}seller:{lotInfoFull.LotInfo.Seller}"
            );
        }

        private static readonly HashSet<long> ExcludedLotIdsCondition =
        [
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
        ];

        [TestCaseSource(nameof(GetLots))]
        public async Task Check_Extractor_Function_Condition(long lotId)
        {
            var lotInfoFull = await BackendClient.GetLotInfoAsync(lotId);

            if (ExcludedLotIdsCondition.Contains(lotId))
            {
                return;
            }

            var extractedFields = ManualFieldsExtractor.ExtractManualData(
                new LotDataToExtract(
                    conditionDescription: lotInfoFull.LotInfo.ConditionDescription,
                    condition: lotInfoFull.LotInfo.Condition,
                    description: lotInfoFull.LotInfo.Description,
                    name: lotInfoFull.LotInfo.Name,
                    shortDescription: lotInfoFull.LotInfo.ShortDescription,
                    lotSize: lotInfoFull.LotInfo.LotSize
                )
            );

            var result = extractedFields["condition"];

            var results = result.OrderByDescending(x => x.Value.Count).ToList();
            var manualCondition = lotInfoFull.LotInfo.Categories.Single(x => x.Type == "condition").Value ??
                throw new AssertionException("manualCondition not found");

            Assert.That(
                condition: results.Count == 0 && manualCondition == WellKnown.Categories.Conditions.New ||
                results.Count == 1 && results[0].Key.Equals(manualCondition, StringComparison.Ordinal) ||
                    results.Count > 1 && results[0].Value.Count > results[1].Value.Count &&
                        results[0].Key.Equals(manualCondition, StringComparison.Ordinal),
                message: $"{ToStr(result)}{Environment.NewLine}lotId: {lotId}{Environment.NewLine}seller:{lotInfoFull.LotInfo.Seller}"
            );
        }


        private static readonly HashSet<long> ExcludedLotIdsState =
        [
            133475288040,
            115507419319,
            134725931500,
            115993741586,
            126212251918
        ];

        [TestCaseSource(nameof(GetLots))]
        public async Task Check_Extractor_Function_TestState(long lotId)
        {
            var lotInfoFull = await BackendClient.GetLotInfoAsync(lotId);

            if (ExcludedLotIdsState.Contains(lotId))
            {
                return;
            }

            var extractedFields = ManualFieldsExtractor.ExtractManualData(
                new LotDataToExtract(
                    conditionDescription: lotInfoFull.LotInfo.ConditionDescription,
                    condition: lotInfoFull.LotInfo.Condition,
                    description: lotInfoFull.LotInfo.Description,
                    name: lotInfoFull.LotInfo.Name,
                    shortDescription: lotInfoFull.LotInfo.ShortDescription,
                    lotSize: lotInfoFull.LotInfo.LotSize
                )
            );

            var result = extractedFields["test_state"];

            var results = result.OrderByDescending(x => x.Value.Count).ToList();
            var manualCondition = lotInfoFull.LotInfo.Categories.Single(x => x.Type == "test_state").Value ??
                throw new AssertionException("testState not found");

            Assert.That(
                condition: results.Count == 0 && manualCondition == WellKnown.Categories.TestState.NotTested ||
                results.Count == 1 && results[0].Key.Equals(manualCondition, StringComparison.Ordinal) ||
                results.Count > 1 && results[0].Value.Count > results[1].Value.Count &&
                    results[0].Key.Equals(manualCondition, StringComparison.Ordinal),
                message: $"{ToStr(result)}{Environment.NewLine}lotId: {lotId}{Environment.NewLine}seller:{lotInfoFull.LotInfo.Seller}"
            );
        }


        private static IEnumerable<TestCaseData> GetLots()
        {
            var allLotIds = BackendClient.GetLotIdsAsync().GetAwaiter().GetResult();

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
            return result.Count == 0
                ? "Empty result"
                : string.Join(
                separator: Environment.NewLine,
                values: result.Select(
                    x =>
                        $"Count {x.Key}, Values: {string.Join(separator: Environment.NewLine + "\t\t\t\t", values: x.Value.Select(x => x.ToString()))}"
                )
            );
        }
    }
}