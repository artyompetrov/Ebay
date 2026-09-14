namespace Server.Domain.LotDataExtraction;

/// <summary>
/// Registry of the lot-classification extractors. The caller (an application-layer use case) is
/// responsible for orchestrating them - running each and collecting its result; this type only
/// hands out the domain's classification policy.
/// </summary>
public static class LotFieldExtractors
{
    /// <summary>Every registered extractor, keyed by <see cref="IExtractor.ExtractedDataName"/> implicitly.</summary>
    public static IReadOnlyList<IExtractor> All { get; } =
    [
        new PcsExtractor(),
        new ConditionExtractor(),
        new TestStateExtractor()
    ];
}