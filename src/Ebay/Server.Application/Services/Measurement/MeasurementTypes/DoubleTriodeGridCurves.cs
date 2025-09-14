
using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement.MeasurementTypes;

public class DoubleTriodeGridCurves : GridCurvesBase
{
    public DoubleTriodeGridCurves(
        double pmaxWatt,
        Dictionary<int, MeasurementPoint[]> measurementPoints) : base(
        pmaxWatt: pmaxWatt,
        measurementPoints: measurementPoints)
    {
    }

    public override string Curve1Name => "Section 1";
    public override string? Curve2Name => "Section 2";
}