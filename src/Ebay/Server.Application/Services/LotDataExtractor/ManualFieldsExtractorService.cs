
using Server.Application.Abstractions.Models.EbayLots;
using Server.Application.Abstractions.Services;

namespace Server.Application.Services.LotDataExtractor;

internal class ManualFieldsExtractorService : IManualFieldsExtractorService
{
    private static readonly IExtractor[] Extractors =
    [
        new PcsExtractor(),
        new ConditionExtractor(),
        new TestStateExtractor()
    ];

    public Dictionary<string, Dictionary<string, HashSet<ExtractionResult>>> ExtractManualData(
        LotDataToExtract lotDataToExtract
    )
    {
        var result = new Dictionary<string, Dictionary<string, HashSet<ExtractionResult>>>();

        foreach (var extractor in Extractors)
        {
            result.Add(
                key: extractor.ExtractedDataName,
                value: extractor.Extract(lotDataToExtract)
            );
        }

        return result;
    }

    public ICollection<CategoryType> GetCategories()
    {
        return
        [
            new(
                Items:
                [
                    new(Description: "NEW", Id: WellKnown.Categories.Conditions.New),
                    new(Description: "USED", Id: WellKnown.Categories.Conditions.Used),
                    new(Description: "NOT WORKING", Id: WellKnown.Categories.Conditions.NotWorking)
                ],
                Type: "condition"
            ),

            new(
                Items:
                [
                    new(Description: "Not tested", Id: WellKnown.Categories.TestState.NotTested),
                    new(Description: "Tested", Id: WellKnown.Categories.TestState.Tested),
                    new(Description: "Mathced", Id: WellKnown.Categories.TestState.Matched)
                ],
                Type: "test_state"
            )
        ];

    }
}