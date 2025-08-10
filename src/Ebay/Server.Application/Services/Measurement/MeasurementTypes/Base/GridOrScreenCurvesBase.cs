namespace Server.Application.Services.Measurement.MeasurementTypes.Base;

public abstract class GridOrScreenCurvesBase : MeasurementTypeBase
{
    protected GridOrScreenCurvesBase(
        int pmax,
        Dictionary<int, MeasurementPoint[]> measurementPoints,
        Func<MeasurementPoint, double> variableSelector) : base(
        pmax: pmax,
        measurementPoints: measurementPoints,
        variableSelector: variableSelector,
        steppingVariableSelector:  m => m.Va)
    {
    }
    
    public override bool PlotPmax => false;
    
    public override string SteppingVariableName => "Vanode";
}