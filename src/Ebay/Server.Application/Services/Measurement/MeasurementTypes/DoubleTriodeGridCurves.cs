using ScottPlot;
using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement.MeasurementTypes;

public class DoubleTriodeGridCurves : GridCurvesBase
{
    public DoubleTriodeGridCurves(int pmax, Dictionary<int, MeasurementPoint[]> measurementPoints) : base(
        pmax: pmax,
        measurementPoints: measurementPoints)
    {
    }

    public override string Curve1Name => "Section 1";
    public override string? Curve2Name => "Section 2";


    public override string SteppingVariableName => "Vgrid";
}