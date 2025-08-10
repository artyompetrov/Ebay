using ScottPlot;
using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement.MeasurementTypes;

public class TriodeAnodeCurves : AnodeCurvesBase
{
    public TriodeAnodeCurves(int pmax, Dictionary<int, MeasurementPoint[]> measurementPoints) : base(pmax, measurementPoints)
    {
    }

    public override string Curve1Name => "Section 1";
    public override string? Curve2Name => null;
}