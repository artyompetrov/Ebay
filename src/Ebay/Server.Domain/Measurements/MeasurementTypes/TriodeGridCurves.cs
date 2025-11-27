using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

public class TriodeGridCurves(
    double pmaxWatt,
    Dictionary<int, MeasurementPoint[]> measurementPoints) : GridCurvesBase(
        pmaxWatt,
        measurementPoints,
        takeMeasurementPointsWhile: (x, maxI) => x.dIa / maxI > IgnoreDi,
        filterCurves: x =>
            {
                // т.к. grid curves замер получен из anode curves, то мы получаем 30 графиков
                // надо уменьшить количество графиков
                const int maxCount = 8;
                var step = (int)Math.Ceiling(x.Count / (double)maxCount);
                return x
                    // первые графики пропускаем, т.к. они в области низких напряжений
                    .Where((_, i) => i % step == 0).ToList();
            })
{
    public override string Curve1Name => "Section 1";
    public override string? Curve2Name => null;
}