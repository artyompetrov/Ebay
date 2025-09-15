namespace Server.Application.Services.Measurement.MeasurementTypes.Base;

public abstract class GridCurvesBase : MeasurementTypeBase
{
    protected GridCurvesBase(
        double pmaxWatt,
        Dictionary<int, MeasurementPoint[]> measurementPoints) : base(
        pmaxWatt: pmaxWatt,
        measurementPoints: measurementPoints,
        variableSelector: m => m.Vg,
        steppingVariableSelector: m => m.Va,
        takeMeasurementPointsWhile: (x, maxI) => x.dIa / maxI > IgnoreDi && x.dIs / maxI > IgnoreDi)
    {
    }

    public override bool PlotPmax => false;


    public override string SteppingVariableName => "Vanode";

    public override string CurveTitle => "Grid curves";

    public override string XLabel => "Vgrid (V)";

}