using ScottPlot;
using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement.MeasurementTypes;

public class PentodeAnodeCurves : AnodeCurvesBase
{
    public PentodeAnodeCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints) :
        base(
            pmaxWatt: pmaxWatt,
            measurementPoints: measurementPoints,
            takeMeasurementPointsWhile: (x, maxI) => x.dIa / maxI > IgnoreDi)
    {
    }

    public override string Curve1Name => "Ianode";
    public override string? Curve2Name => "Iscreen";
}