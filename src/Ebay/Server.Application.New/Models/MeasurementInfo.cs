using Server.Domain.Measurements;

namespace Server.Application.New.Models;

public record MeasurementInfo(
    string Id,
    Guid ProductId,
    string? MatchId,
    string? LotId,
    string? Location,
    MeasurementState MeasurementState,
    ProductState ProductState,
    string ManufactureCode,
    DateTime CreatedAt,
    DateTime? LastTimeWatchedOnEbay)
{
    public bool IsPublishedOnEbay => LastTimeWatchedOnEbay > DateTime.UtcNow.AddDays(-7);
};
