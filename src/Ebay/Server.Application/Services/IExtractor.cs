using LotDataToExtract = Server.Controllers.Generated.LotDataToExtract;

namespace Server.Application.Services;

internal interface IExtractor
{
    public string ExtractedDataName { get; }

    public Dictionary<string, HashSet<ExtractionResult>> Extract(LotDataToExtract lotDataToExtract);
}