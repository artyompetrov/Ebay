using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

public class DoubleTriodeAnodeCurves : AnodeCurvesBase
{
    public DoubleTriodeAnodeCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints)
        : base(
            pmaxWatt: pmaxWatt,
            measurementPoints: measurementPoints,
            takeMeasurementPointsWhile: (x, maxI) => x.DeltaIa / maxI > IgnoreDi && x.DeltaIs / maxI > IgnoreDi)
    {
    }

    public override string Curve1Name => "Section 1";
    public override string? Curve2Name => "Section 2";

    public override GridCurvesBase ConvertToGridCurves()
    {
        return new DoubleTriodeGridCurves(
            pmaxWatt: PmaxWatt,
            measurementPoints: GetGridCurvesFromAnodeCurves(MeasurementPoints));
    }
}