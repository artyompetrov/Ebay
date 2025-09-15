namespace Server.Application.Services.Measurement.MeasurementTypes.Base;

public abstract class GridCurvesBase : MeasurementTypeBase
{
    protected GridCurvesBase(
        double pmaxWatt,
        Dictionary<int, MeasurementPoint[]> measurementPoints,
        Func<MeasurementPointWithDelta, double, bool> takeMeasurementPointsWhile) : base(
        pmaxWatt: pmaxWatt,
        measurementPoints: measurementPoints,
        variableSelector: m => m.Vg,
        steppingVariableSelector: m => m.Va,
        takeMeasurementPointsWhile: takeMeasurementPointsWhile,
        filterCurves: x =>
        {
            // т.к. grid curves замер получен из anode curves, то мы получаем 30 графиков
            // надо уменьшить количество графиков
            const int maxCount = 5;
            const int skipCount = 0;
            
            var step = (int)Math.Ceiling((x.Count - skipCount) / (double)maxCount);
            return x
                    // первые графики пропускаем, т.к. они в области низких напряжений
                .Skip(skipCount)
                .Where((_, i) => i % step == 0).ToList();
        })
    {
    }

    public override bool PlotPmax => false;


    public override string SteppingVariableName => "Vanode";

    public override string CurveTitle => "Grid curves";

    public override string XLabel => "Vgrid (V)";

}