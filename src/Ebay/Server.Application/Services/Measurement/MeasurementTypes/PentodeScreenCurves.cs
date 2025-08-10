using ScottPlot;
using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement.MeasurementTypes;

public class PentodeScreenCurves : ScreenCurvesBase
{
    public PentodeScreenCurves(int pmax, Dictionary<int, MeasurementPoint[]> measurementPoints) : base(pmax, measurementPoints)
    {
    }

    public override string Curve1Name => "Ianode";
    public override string? Curve2Name => "Iscreen";
}