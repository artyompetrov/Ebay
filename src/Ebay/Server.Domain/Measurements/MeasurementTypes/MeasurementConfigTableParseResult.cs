using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

public record MeasurementConfigTableParseResult(MeasurementTypeBase? MeasurementType, int SteppingVariableCount, int NumberOfIntervals);