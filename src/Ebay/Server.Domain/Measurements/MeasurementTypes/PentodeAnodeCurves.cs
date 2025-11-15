using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes
{
    public class PentodeAnodeCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints) : AnodeCurvesBase(
            pmaxWatt: pmaxWatt,
            measurementPoints: measurementPoints,
            takeMeasurementPointsWhile: (x, maxI) => x.dIa / maxI > IgnoreDi)
    {
        public override string Curve1Name => "Ianode";
        public override string? Curve2Name => "Iscreen";

        public override GridCurvesBase ConvertToGridCurves()
        {
            return new PentodeGridCurves(
            pmaxWatt: PmaxWatt,
            measurementPoints: GetGridCurvesFromAnodeCurves(MeasurementPoints));
        }
    }
}