using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

/// <summary>
/// класс доменной модели.
/// </summary>
public class TriodeGridCurves : GridCurvesBase
{
    /// <summary>
    /// операция.
    /// </summary>
    public TriodeGridCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints)
        : base(
            pmaxWatt,
            measurementPoints,
            takeMeasurementPointsWhile: (x, maxI) => x.DeltaIa / maxI > IgnoreDi,
            filterCurves: x =>
            {
                // т.к. grid curves замер получен из anode curves, то мы получаем 30 графиков
                // надо уменьшить количество графиков
                const int maxCount = 8;
                var step = (int)Math.Ceiling(x.Count / (double)maxCount);
                return [.. x
                    // первые графики пропускаем, т.к. они в области низких напряжений
                    .Where((_, i) => i % step == 0)];
            })
    {
    }

    /// <summary>
    /// свойство.
    /// </summary>
    public override string Curve1Name => "Section 1";
    /// <summary>
    /// свойство.
    /// </summary>
    public override string? Curve2Name => null;
}
