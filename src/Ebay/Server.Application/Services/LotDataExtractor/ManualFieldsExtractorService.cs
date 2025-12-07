
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
        return Task.FromResult<ICollection<CategoryType>>(
            [
                new(
                    items:
                    [
                        new(description: "NEW", id: WellKnown.Categories.Conditions.New),
                        new(description: "USED", id: WellKnown.Categories.Conditions.Used),
                        new(description: "NOT WORKING", id: WellKnown.Categories.Conditions.NotWorking)
                    ],
                    type: "condition"
                ),

                new(
                    items:
                    [
                        new(description: "Not tested", id: WellKnown.Categories.TestState.NotTested),
                        new(description: "Tested", id: WellKnown.Categories.TestState.Tested),
                        new(description: "Mathced", id: WellKnown.Categories.TestState.Matched)
                    ],
                    type: "test_state"
                )
            ]
        );
    }
}