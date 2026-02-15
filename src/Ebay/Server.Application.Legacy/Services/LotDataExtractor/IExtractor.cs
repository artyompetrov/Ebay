using LotDataToExtract = Server.Controllers.Generated.LotDataToExtract;

namespace Server.Application.Services.LotDataExtractor;

internal interface IExtractor
{
    string ExtractedDataName { get; }

    Dictionary<string, HashSet<ExtractionResult>> Extract(LotDataToExtract lotDataToExtract);
}