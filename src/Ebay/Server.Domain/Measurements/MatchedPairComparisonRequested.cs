using Server.Domain.Abstractions;

namespace Server.Domain.Measurements;

public sealed record MatchedPairComparisonRequested(string Measurement1Id, string Measurement2Id) : IDomainEvent;
