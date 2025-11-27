using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

public class DoubleTriodeAnodeCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints) : AnodeCurvesBase(
        pmaxWatt: pmaxWatt,
        measurementPoints: measurementPoints,
        takeMeasurementPointsWhile: (x, maxI) => x.dIa / maxI > IgnoreDi && x.dIs / maxI > IgnoreDi)
{
    public override string Curve1Name => "Section 1";
    public override string? Curve2Name => "Section 2";

    public override GridCurvesBase ConvertToGridCurves()
    {
        return new DoubleTriodeGridCurves(
        pmaxWatt: PmaxWatt,
        measurementPoints: GetGridCurvesFromAnodeCurves(MeasurementPoints));
    }
}