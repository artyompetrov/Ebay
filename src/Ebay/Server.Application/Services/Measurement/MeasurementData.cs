using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement;

public record MeasurementData(
    Guid ProductId,
    string MeasurementId,
    string ManufactureCode,
    ProductState ProductState,
    AnodeCurvesBase AnodeCurves,
    GridCurvesBase GridCurves,
    string QuickTest);