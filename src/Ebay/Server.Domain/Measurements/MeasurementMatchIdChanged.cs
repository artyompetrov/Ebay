using Server.Domain.Abstractions;

namespace Server.Domain.Measurements;

public sealed record MeasurementMatchIdChanged(
    string MeasurementId,
    string? OldMatchId,
    string? NewMatchId) : IDomainEvent;
