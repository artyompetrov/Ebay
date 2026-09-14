namespace Server.Application.New.LotDataExtractor;

internal interface IExtractor
{
    string ExtractedDataName { get; }

    Dictionary<string, HashSet<ExtractionResult>> Extract(LotTextFields lotTextFields);
}