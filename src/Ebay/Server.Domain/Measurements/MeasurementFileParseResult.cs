using Server.Domain.Measurements.MeasurementTypes;

namespace Server.Domain.Measurements;

/// <summary>
/// DTO-модель.
/// </summary>
public record MeasurementFileParseResult(
    int FileCount,
    MeasurementConfigTableParseResult MeasurementConfigTableParseResult,
    string HashAnodeCurves,
    string HashAnodeCurvesConfig);
