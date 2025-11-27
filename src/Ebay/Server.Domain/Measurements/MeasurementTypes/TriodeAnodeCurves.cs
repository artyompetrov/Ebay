using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

public class TriodeAnodeCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints) : AnodeCurvesBase(
    pmaxWatt: pmaxWatt,
    measurementPoints: measurementPoints,
    takeMeasurementPointsWhile: (x, maxI) => x.dIa / maxI > IgnoreDi)
{
    public override string Curve1Name => "Section 1";
    public override string? Curve2Name => null;

    public override GridCurvesBase ConvertToGridCurves()
    {
        return new TriodeGridCurves(
            pmaxWatt: PmaxWatt,
            measurementPoints: GetGridCurvesFromAnodeCurves(MeasurementPoints));
    }
}