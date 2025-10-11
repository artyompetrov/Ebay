using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Measurements;

public record MeasurementInfo(
    string Id,
    Guid ProductId,
    ProductState ProductState,
    string ManufactureCode);