namespace Server.Domain.Measurements.MeasurementTypes.Base;

/// <summary>
/// класс доменной модели.
/// </summary>
public abstract class AnodeCurvesBase : MeasurementTypeBase
{
    /// <summary>
    /// Создает базовый тип анодных характеристик для конкретного типа лампы.
    /// </summary>
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

    /// <summary>
    /// свойство.
    /// </summary>
    public override bool PlotPmax => true;

    /// <summary>
    /// свойство.
    /// </summary>
    public override string CurveTitle => "Anode curves";

    /// <summary>
    /// операция.
    /// </summary>
    public override string XLabel => "Vanode (V)";

    /// <summary>
    /// свойство.
    /// </summary>
    public override string SteppingVariableName => "Vgrid";

    /// <summary>
    /// Функция, которая вычисляет сеточные характеристики из анодных
    /// </summary>
    public abstract GridCurvesBase ConvertToGridCurves();
}
