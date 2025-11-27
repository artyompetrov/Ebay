namespace Server.Domain.Measurements;

public record MatchedPairDifferenceId(
    string Measurement1Id,
    string Measurement2Id,
    ComparisonMode ComparisonMode);