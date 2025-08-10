using ScottPlot;
using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement.MeasurementTypes;

public class TriodeGridCurves : GridCurvesBase
{
    public TriodeGridCurves(int pmax, Dictionary<int, MeasurementPoint[]> measurementPoints) : base(pmax, measurementPoints)
    {
    }

    public override string Curve1Name => "Section 1";
    public override string? Curve2Name => null;
}