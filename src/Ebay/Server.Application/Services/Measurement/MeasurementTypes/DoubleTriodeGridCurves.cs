
using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement.MeasurementTypes;

public class DoubleTriodeGridCurves : GridCurvesBase
{
    public DoubleTriodeGridCurves(
        double pmaxWatt,
        Dictionary<int, MeasurementPoint[]> measurementPoints) : base(
        pmaxWatt: pmaxWatt,
        measurementPoints: measurementPoints,
        takeMeasurementPointsWhile: (x, maxI) => x.dIa / maxI > IgnoreDi && x.dIs / maxI > IgnoreDi,
        filterCurves: x =>
        {
            // т.к. grid curves замер получен из anode curves, то мы получаем 30 графиков
            // надо уменьшить количество графиков
            const int maxCount = 8;
            var step = (int)Math.Floor((x.Count - maxCount) / (double)maxCount);
            return x
                // первые графики пропускаем, т.к. они в области низких напряжений
                .Where((_, i) => i % step == 0).ToList();
        })
    {
    }

    public override string Curve1Name => "Section 1";
    public override string? Curve2Name => "Section 2";
}