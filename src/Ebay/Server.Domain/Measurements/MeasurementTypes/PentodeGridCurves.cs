using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

public class PentodeGridCurves : GridCurvesBase
{
    public PentodeGridCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints)
        : base(
            pmaxWatt: pmaxWatt,
            measurementPoints: measurementPoints,
            takeMeasurementPointsWhile: (x, maxI) => x.DeltaIa / maxI > IgnoreDi && x.DeltaIs / maxI > IgnoreDi,
            filterCurves: x =>
            {
                // т.к. grid curves замер получен из anode curves, то мы получаем много графиков
                // оставляем область высоких напряжений и прореживаем только низкие
                const int maxCount = 8;
                const int skipCount = 10;

                var highVoltageCurves = x.Skip(skipCount).ToList();
                return highVoltageCurves.Count <= maxCount
                    ? [.. highVoltageCurves]
                    : [.. highVoltageCurves.Skip(highVoltageCurves.Count - maxCount)];
            })
    {
    }

    public override string Curve1Name => "Ianode";
    public override string? Curve2Name => "Iscreen";
}