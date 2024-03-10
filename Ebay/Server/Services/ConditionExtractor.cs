using Ebay.Server.Controllers.Generated;

namespace Ebay.Server.Services;

internal class ConditionExtractor : IExtractor
{
    public string ExtractedDataName => "condition";
    
    public Dictionary<string, HashSet<ExtractionResult>> Extract(LotDataToExtract lotDataToExtract)
    {
        var result = new Dictionary<string, HashSet<ExtractionResult>>();
        
       // var condition = lotDataToExtract.co
        
        return result;
    }
}