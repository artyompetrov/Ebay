using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement;

public record MeasurementConfigTableParseResult(MeasurementTypeBase MeasurementType, int SteppingVariableCount);