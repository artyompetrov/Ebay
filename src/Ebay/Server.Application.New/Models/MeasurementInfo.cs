using Server.Domain.Measurements;

namespace Server.Application.New.Models;

// TODO(architecture): Тип содержит не только данные, но и поведение/бизнес-правило
// (IsPublishedOnEbay с фиксированным окном в 7 дней).
// Позже вынести это правило в policy/сервис и оставить здесь только DTO-данные.
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