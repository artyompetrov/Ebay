using Server.Controllers.Generated;

namespace Server.Application.Services.LotDataExtractor;

internal static class ManualFieldsExtractor
{
    private static readonly IExtractor[] Extractors =
    [
        new PcsExtractor(),
        new ConditionExtractor(),
        new TestStateExtractor()
    ];

    public static Dictionary<string, Dictionary<string, HashSet<ExtractionResult>>> ExtractManualData(
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
}