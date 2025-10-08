using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

public record MeasurementConfigTableParseResult(
    AnodeCurvesBase AnodeCurves,
    int SteppingVariableCount,
    int NumberOfIntervals);