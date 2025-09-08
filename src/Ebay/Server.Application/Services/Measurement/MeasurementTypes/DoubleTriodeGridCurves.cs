using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement.MeasurementTypes;

[Obsolete("возможно неактуально")]
public class DoubleTriodeGridCurves : GridCurvesBase
{
    public DoubleTriodeGridCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints) : base(
        pmaxWatt: pmaxWatt,
        measurementPoints: measurementPoints)
    {
    }

    public override string Curve1Name => "Section 1";
    public override string? Curve2Name => "Section 2";


    public override string SteppingVariableName => "Vgrid";
}