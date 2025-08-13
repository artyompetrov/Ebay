using ScottPlot;
using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement.MeasurementTypes;

public class PentodeScreenCurves : ScreenCurvesBase
{
    public PentodeScreenCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints) : base(pmaxWatt, measurementPoints)
    {
    }

    public override string Curve1Name => "Ianode";
    public override string? Curve2Name => "Iscreen";
}