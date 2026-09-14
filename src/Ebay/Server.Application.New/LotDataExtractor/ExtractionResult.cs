namespace Server.Application.New.LotDataExtractor;

/// <summary>
/// One regex match that contributed to a candidate category value, kept for diagnostics/review.
/// </summary>
public record struct ExtractionResult(ExtractFrom ExtractedFrom, string Extractor, string Match)
{
    public override readonly string ToString() => $"{nameof(ExtractedFrom)}: '{ExtractedFrom}', {nameof(Extractor)}: '{Extractor}', {nameof(Match)}: '{Match}'";
}