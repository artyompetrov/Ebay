namespace Server.Application.Services.Measurement.MeasurementTypes.Base;

public abstract class GridCurvesBase : MeasurementTypeBase
{
    protected GridCurvesBase(
        double pmaxWatt,
        Dictionary<int, MeasurementPoint[]> measurementPoints,
        Func<MeasurementPointWithDelta, double, bool> takeMeasurementPointsWhile,
        Func<ICollection<MeasurementPointWithDelta[]>, ICollection<MeasurementPointWithDelta[]>> filterCurves) : base(
        pmaxWatt: pmaxWatt,
        measurementPoints: measurementPoints,
        variableSelector: m => m.Vg,
        steppingVariableSelector: m => m.Va,
        takeMeasurementPointsWhile: takeMeasurementPointsWhile,
        filterCurves: filterCurves)
    {
    }

    public override bool PlotPmax => false;


    public override string SteppingVariableName => "Vanode";

    public override string CurveTitle => "Grid curves";

    public override string XLabel => "Vgrid (V)";

}