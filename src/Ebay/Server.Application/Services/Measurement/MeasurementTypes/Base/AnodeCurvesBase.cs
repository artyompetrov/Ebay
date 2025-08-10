using ScottPlot;

namespace Server.Application.Services.Measurement.MeasurementTypes.Base;

public abstract class AnodeCurvesBase : MeasurementTypeBase
{
    protected AnodeCurvesBase(
        int pmax,
        Dictionary<int, MeasurementPoint[]> measurementPoints) : base(
        pmax: pmax,
        measurementPoints: measurementPoints,
        variableSelector:  m => m.Va,
        steppingVariableSelector:  m => m.Vg)
    {
    }

    public override bool PlotPmax => true;

    public override string CurveTitle => "Anode curves";

    public override string XLabel => "Vanode (V)";
    
    public override string SteppingVariableName => "Vgrid";
}