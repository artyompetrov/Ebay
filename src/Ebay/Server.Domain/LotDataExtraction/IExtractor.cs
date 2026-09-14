namespace Server.Domain.LotDataExtraction;

/// <summary>
/// Classifies one category (e.g. condition, pcs, test state) from a lot's free-text fields.
/// </summary>
public interface IExtractor
{
    string ExtractedDataName { get; }

    Dictionary<string, HashSet<ExtractionResult>> Extract(LotTextFields lotTextFields);
}