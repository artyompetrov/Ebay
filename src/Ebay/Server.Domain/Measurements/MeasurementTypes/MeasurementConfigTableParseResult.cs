using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

/// <summary>
/// DTO-модель.
/// </summary>
public record MeasurementConfigTableParseResult(
    AnodeCurvesBase AnodeCurves,
    int SteppingVariableCount,
    int NumberOfIntervals);
