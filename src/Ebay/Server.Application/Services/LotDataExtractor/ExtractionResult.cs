namespace Server.Application.Services.LotDataExtractor
{
    internal record struct ExtractionResult(ExtractFrom ExtractedFrom, string Extractor, string Match)
    {
        public override readonly string ToString() => $"{nameof(ExtractedFrom)}: '{ExtractedFrom}', {nameof(Extractor)}: '{Extractor}', {nameof(Match)}: '{Match}'";
    }
}