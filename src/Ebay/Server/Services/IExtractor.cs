using LotDataToExtract = Server.Controllers.Generated.LotDataToExtract;

namespace Server.Services;

internal interface IExtractor
{
    public string ExtractedDataName { get; }

    public Dictionary<string, HashSet<ExtractionResult>> Extract(LotDataToExtract lotDataToExtract);
}