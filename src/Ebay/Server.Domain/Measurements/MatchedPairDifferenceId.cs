namespace Server.Domain.Measurements;

/// <summary>
/// DTO-модель.
/// </summary>
public record MatchedPairDifferenceId(
    string Measurement1Id,
    string Measurement2Id,
    ComparisonMode ComparisonMode);
