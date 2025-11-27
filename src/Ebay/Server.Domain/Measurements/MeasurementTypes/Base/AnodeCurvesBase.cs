namespace Server.Domain.Measurements.MeasurementTypes.Base;

public abstract class AnodeCurvesBase : MeasurementTypeBase
{
    protected AnodeCurvesBase(
        double pmaxWatt,
        Dictionary<int, MeasurementPoint[]> measurementPoints,
        Func<MeasurementPointWithDelta, double, bool> takeMeasurementPointsWhile) : base(
        pmaxWatt: pmaxWatt,
        measurementPoints: measurementPoints,
        variableSelector: m => m.Va,
        steppingVariableSelector: m => m.Vg,
        takeMeasurementPointsWhile: takeMeasurementPointsWhile,
        filterCurves: x => x)
    {
    }

    public override bool PlotPmax => true;

    public override string CurveTitle => "Anode curves";

    public override string XLabel => "Vanode (V)";

    public override string SteppingVariableName => "Vgrid";

    /// <summary>
    /// Функция, которая вычисляет сеточные характеристики из анодных
    /// </summary>
    public abstract GridCurvesBase ConvertToGridCurves();
}