using Server.Application.Data.Models;

namespace Server.Application.Services.MeasurementService;

public record MeasurementData(
    Guid ProductId,
    string MeasurementId,
    string ManufactureCode,
    ProductState ProductState,
    MeasurementConfig AnodeCurvesConfig,
    MeasurementConfig GridCurvesConfig,
    IReadOnlyDictionary<int, MeasurementPoint[]> AnodeCurves,
    IReadOnlyDictionary<int, MeasurementPoint[]> GridCurves,
    string QuickTest);