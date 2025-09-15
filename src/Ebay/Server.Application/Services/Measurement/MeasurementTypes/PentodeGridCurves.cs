using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement.MeasurementTypes;

public class PentodeGridCurves : GridCurvesBase
{
    public PentodeGridCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints) :
        base(
            pmaxWatt: pmaxWatt,
            measurementPoints: measurementPoints,
            takeMeasurementPointsWhile: (x, maxI) => x.dIa / maxI > IgnoreDi && x.dIs / maxI > IgnoreDi)
    {
    }

    public override string Curve1Name => "Ianode";
    public override string? Curve2Name => "Iscreen";
}