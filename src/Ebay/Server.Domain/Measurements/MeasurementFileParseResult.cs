using Server.Domain.Measurements.MeasurementTypes;

namespace Server.Domain.Measurements;

public record MeasurementFileParseResult(int FileCount, MeasurementConfigTableParseResult MeasurementConfigTableParseResult, string HashAnodeCurves, string HashAnodeCurvesConfig, string HashQuickTest);