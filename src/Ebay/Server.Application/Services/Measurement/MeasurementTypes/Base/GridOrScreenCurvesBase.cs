namespace Server.Application.Services.Measurement.MeasurementTypes.Base;

public abstract class GridOrScreenCurvesBase : MeasurementTypeBase
{
    protected GridOrScreenCurvesBase(
        double pmaxWatt,
        Dictionary<int, MeasurementPoint[]> measurementPoints,
        Func<MeasurementPoint, double> variableSelector) : base(
        pmaxWatt: pmaxWatt,
        measurementPoints: measurementPoints,
        variableSelector: variableSelector,
        steppingVariableSelector: m => m.Va,
        takeMeasurementPointsWhile: (x, maxI) => x.dIa / maxI > IgnoreDi && x.dIs / maxI > IgnoreDi)
    {
    }

    public override bool PlotPmax => false;

    public override string SteppingVariableName => "Vanode";
}