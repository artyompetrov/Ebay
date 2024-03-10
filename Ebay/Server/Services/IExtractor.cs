using LotDataToExtract = Ebay.Server.Controllers.Generated.LotDataToExtract;

namespace Ebay.Server.Services;

internal interface IExtractor
{
    public string ExtractedDataName { get; }

    public Dictionary<string, HashSet<ExtractionResult>> Extract(LotDataToExtract lotDataToExtract);
}