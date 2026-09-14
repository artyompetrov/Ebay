using Server.Domain.LotDataExtraction;

namespace Server.Application.New.LotDataExtractor;

/// <summary>
/// Orchestrates the domain's lot-classification extractors to guess candidate condition/pcs/test-state
/// category values for a lot listing, helping a human confirm/correct manual data entry.
/// </summary>
public static class ManualFieldsExtractor
{
    /// <summary>
    /// Runs every registered extractor over <paramref name="lotTextFields"/> and returns, per
    /// extractor name, the candidate values it found together with the matches that produced them.
    /// </summary>
    public static Dictionary<string, Dictionary<string, HashSet<ExtractionResult>>> ExtractManualData(
        LotTextFields lotTextFields
    )
    {
        var result = new Dictionary<string, Dictionary<string, HashSet<ExtractionResult>>>();

        foreach (var extractor in LotFieldExtractors.All)
        {
            result.Add(
                key: extractor.ExtractedDataName,
                value: extractor.Extract(lotTextFields)
            );
        }

        return result;
    }
}