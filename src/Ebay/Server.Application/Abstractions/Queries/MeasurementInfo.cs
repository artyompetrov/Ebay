using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Queries;

public record MeasurementInfo(
    string Id,
    Guid ProductId,
    string? MatchId,
    string? LotId,
    MeasurementState MeasurementState,
    ProductState ProductState,
    string ManufactureCode);