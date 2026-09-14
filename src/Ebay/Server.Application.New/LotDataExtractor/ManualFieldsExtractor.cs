namespace Server.Application.New.LotDataExtractor;

/// <summary>
/// Guesses candidate condition/pcs/test-state category values for a lot listing from its free-text
/// fields, to help a human confirm/correct manual data entry. Produces suggestions only - it never
/// mutates a <see cref="Domain.Lot"/> and enforces no invariant.
/// </summary>
public static class ManualFieldsExtractor
{
    private static readonly IExtractor[] Extractors =
    [
        new PcsExtractor(),
        new ConditionExtractor(),
        new TestStateExtractor()
    ];

    /// <summary>
    /// Runs every registered extractor over <paramref name="lotTextFields"/> and returns, per
    /// extractor name, the candidate values it found together with the matches that produced them.
    /// </summary>
    public static Dictionary<string, Dictionary<string, HashSet<ExtractionResult>>> ExtractManualData(
        LotTextFields lotTextFields
    )
    {
        var result = new Dictionary<string, Dictionary<string, HashSet<ExtractionResult>>>();

        foreach (var extractor in Extractors)
        {
            result.Add(
                key: extractor.ExtractedDataName,
                value: extractor.Extract(lotTextFields)
            );
        }

        return result;
    }
}