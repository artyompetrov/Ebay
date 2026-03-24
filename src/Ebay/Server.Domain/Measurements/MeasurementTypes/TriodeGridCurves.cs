using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

public class TriodeGridCurves : GridCurvesBase
{
    public TriodeGridCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints)
        : base(
            pmaxWatt,
            measurementPoints,
            takeMeasurementPointsWhile: (x, maxI) => x.DeltaIa / maxI > IgnoreDi,
            filterCurves: x =>
            {
                // т.к. grid curves замер получен из anode curves, то мы получаем много графиков
                // оставляем область высоких напряжений и прореживаем только низкие
                const int maxCount = 8;
                return x.Count <= maxCount
                    ? [.. x]
                    : [.. x.Skip(x.Count - maxCount)];
            })
    {
    }

    public override string Curve1Name => "Section 1";
    public override string? Curve2Name => null;
}