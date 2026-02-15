namespace Server.Domain.Measurements.MeasurementTypes.Base;

/// <summary>
/// класс доменной модели.
/// </summary>
public abstract class GridCurvesBase : MeasurementTypeBase
{
    /// <summary>
    /// Создает базовый тип сеточных характеристик для конкретного типа лампы.
    /// </summary>
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

    /// <summary>
    /// свойство.
    /// </summary>
    public override bool PlotPmax => false;


    /// <summary>
    /// свойство.
    /// </summary>
    public override string SteppingVariableName => "Vanode";

    /// <summary>
    /// свойство.
    /// </summary>
    public override string CurveTitle => "Grid curves";

    /// <summary>
    /// операция.
    /// </summary>
    public override string XLabel => "Vgrid (V)";

}
