using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Queries;

public record MeasurementInfo(
    string Id,
    Guid ProductId,
    string? MatchId,
    string? LotId,
    string? Location,
    MeasurementState MeasurementState,
    ProductState ProductState,
    string ManufactureCode,
    DateTime? LastTimeWatchedOnEbay)
{
    public bool IsPublishedOnEbay => LastTimeWatchedOnEbay > DateTime.UtcNow.AddDays(-7);
};