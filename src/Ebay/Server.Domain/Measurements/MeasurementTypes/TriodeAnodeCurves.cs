using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

public class TriodeAnodeCurves : AnodeCurvesBase
{
    public TriodeAnodeCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints) : base(
        pmaxWatt: pmaxWatt,
        measurementPoints: measurementPoints,
        takeMeasurementPointsWhile: (x, maxI) => x.dIa / maxI > IgnoreDi)
    {
    }

    public override string Curve1Name => "Section 1";
    public override string? Curve2Name => null;

    public override GridCurvesBase ConvertToGridCurves() =>
        new TriodeGridCurves(
            pmaxWatt: PmaxWatt,
            measurementPoints: GetGridCurvesFromAnodeCurves(MeasurementPoints));
}