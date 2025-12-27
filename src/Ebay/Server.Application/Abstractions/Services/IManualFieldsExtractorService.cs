using Server.Application.Abstractions.Models.EbayLots;
using Server.Application.Services.LotDataExtractor;

namespace Server.Application.Abstractions.Services;

public interface IManualFieldsExtractorService
{
    Dictionary<string, Dictionary<string, HashSet<ExtractionResult>>> ExtractManualData(
        LotDataToExtract lotDataToExtract
    );

    ICollection<CategoryType> GetCategories();
}