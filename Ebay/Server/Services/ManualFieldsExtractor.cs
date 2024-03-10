using Ebay.Server.Controllers.Generated;
namespace Ebay.Server.Services;

internal static class ManualFieldsExtractor
{
    private static readonly IExtractor[] Extractors = { new PcsExtractor() };

    public static Dictionary<string, Dictionary<string, HashSet<ExtractionResult>>> ExtractCount(
        LotDataToExtract lotDataToExtract
    )
    {
        var result = new Dictionary<string, Dictionary<string, HashSet<ExtractionResult>>>();

        foreach (var extractor in Extractors)
        {
            result.Add(
                extractor.ExtractedDataName,
                extractor.Extract(lotDataToExtract)
            );
        }

        return result;
    }
}