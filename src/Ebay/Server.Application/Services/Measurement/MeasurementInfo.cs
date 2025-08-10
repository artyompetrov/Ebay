using Server.Application.Data.Models;

namespace Server.Application.Services.Measurement;

public record MeasurementInfo(
    string Id,
    string ManufactureCode,
    ProductState ProductState,
    string? Location,
    string? MatchId,
    MeasurementState MeasurementState);

