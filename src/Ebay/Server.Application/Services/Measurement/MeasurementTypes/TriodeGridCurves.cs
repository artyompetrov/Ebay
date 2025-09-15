using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement.MeasurementTypes;

public class TriodeGridCurves : GridCurvesBase
{
    public TriodeGridCurves(
        double pmaxWatt,
        Dictionary<int, MeasurementPoint[]> measurementPoints) :
        base(pmaxWatt, measurementPoints, takeMeasurementPointsWhile: (x, maxI) => x.dIa / maxI > IgnoreDi)
    {
    }

    public override string Curve1Name => "Section 1";
    public override string? Curve2Name => null;
}