namespace Server.Application.Services.LotDataExtractor;

public record struct ExtractionResult(ExtractFrom ExtractedFrom, string Extractor, string Match)
{
    public override readonly string ToString() => $"{nameof(ExtractedFrom)}: '{ExtractedFrom}', {nameof(Extractor)}: '{Extractor}', {nameof(Match)}: '{Match}'";
}