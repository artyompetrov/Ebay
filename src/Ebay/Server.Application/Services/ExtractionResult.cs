namespace Server.Application.Services;

internal record struct ExtractionResult(ExtractFrom ExtractedFrom, string Extractor, string Match)
{
    public override string ToString()
    {
        return
            $"{nameof(ExtractedFrom)}: '{ExtractedFrom}', {nameof(Extractor)}: '{Extractor}', {nameof(Match)}: '{Match}'";
    }
}