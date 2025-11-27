using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

public class PentodeGridCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints) : GridCurvesBase(
        pmaxWatt: pmaxWatt,
        measurementPoints: measurementPoints,
        takeMeasurementPointsWhile: (x, maxI) => x.dIa / maxI > IgnoreDi && x.dIs / maxI > IgnoreDi,
        filterCurves: x =>
            {
                // т.к. grid curves замер получен из anode curves, то мы получаем 30 графиков
                // надо уменьшить количество графиков
                const int maxCount = 8;
                const int skipCount = 10;
                var step = (int)Math.Ceiling((x.Count - skipCount) / (double)maxCount);
                return x
                    .Skip(skipCount)
                    // первые графики пропускаем, т.к. они в области низких напряжений
                    .Where((_, i) => i % step == 0).ToList();
            })
{
    public override string Curve1Name => "Ianode";
    public override string? Curve2Name => "Iscreen";
}