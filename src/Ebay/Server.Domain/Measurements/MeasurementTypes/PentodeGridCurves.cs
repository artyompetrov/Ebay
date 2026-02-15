using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

/// <summary>
/// класс доменной модели.
/// </summary>
public class PentodeGridCurves : GridCurvesBase
{
    /// <summary>
    /// операция.
    /// </summary>
    public PentodeGridCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints)
        : base(
            pmaxWatt: pmaxWatt,
            measurementPoints: measurementPoints,
            takeMeasurementPointsWhile: (x, maxI) => x.DeltaIa / maxI > IgnoreDi && x.DeltaIs / maxI > IgnoreDi,
            filterCurves: x =>
            {
                // т.к. grid curves замер получен из anode curves, то мы получаем 30 графиков
                // надо уменьшить количество графиков
                const int maxCount = 8;
                const int skipCount = 10;
                var step = (int)Math.Ceiling((x.Count - skipCount) / (double)maxCount);
                return [.. x
                    .Skip(skipCount)
                    // первые графики пропускаем, т.к. они в области низких напряжений
                    .Where((_, i) => i % step == 0)];
            })
    {
    }

    /// <summary>
    /// свойство.
    /// </summary>
    public override string Curve1Name => "Ianode";
    /// <summary>
    /// свойство.
    /// </summary>
    public override string? Curve2Name => "Iscreen";
}
