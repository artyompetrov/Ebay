using Server.Domain.Abstractions;

namespace Server.Domain.Measurements;

public sealed record MeasurementStateChanged(string MeasurementId) : IDomainEvent;
