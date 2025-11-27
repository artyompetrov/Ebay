using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

public class DoubleTriodeGridCurves(
    double pmaxWatt,
    Dictionary<int, MeasurementPoint[]> measurementPoints) : GridCurvesBase(
    pmaxWatt: pmaxWatt,
    measurementPoints: measurementPoints,
    takeMeasurementPointsWhile: (x, maxI) => x.DeltaIa / maxI > IgnoreDi && x.DeltaIs / maxI > IgnoreDi,
    filterCurves: x =>
        {
            // т.к. grid curves замер получен из anode curves, то мы получаем 30 графиков
            // надо уменьшить количество графиков
            const int maxCount = 8;
            var step = (int)Math.Floor(x.Count / (double)maxCount);
            return x
                // первые графики пропускаем, т.к. они в области низких напряжений
                .Where((_, i) => i % step == 0).ToList();
        })
{
    public override string Curve1Name => "Section 1";
    public override string? Curve2Name => "Section 2";
}