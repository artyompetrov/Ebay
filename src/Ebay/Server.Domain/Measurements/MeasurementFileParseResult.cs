using Server.Domain.Measurements.MeasurementTypes;

namespace Server.Domain.Measurements
{
    public record MeasurementFileParseResult(
        int FileCount,
        MeasurementConfigTableParseResult MeasurementConfigTableParseResult,
        string PrettifiedQuickTest,
        string HashAnodeCurves,
        string HashAnodeCurvesConfig,
        string HashQuickTest);
}