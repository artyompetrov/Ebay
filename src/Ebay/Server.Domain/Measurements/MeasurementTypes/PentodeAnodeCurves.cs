using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

/// <summary>
/// класс доменной модели.
/// </summary>
public class PentodeAnodeCurves : AnodeCurvesBase
{
    /// <summary>
    /// операция.
    /// </summary>
    public PentodeAnodeCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints)
        : base(
            pmaxWatt: pmaxWatt,
            measurementPoints: measurementPoints,
            takeMeasurementPointsWhile: (x, maxI) => x.DeltaIa / maxI > IgnoreDi)
    {
    }

    /// <summary>
    /// свойство.
    /// </summary>
    public override string Curve1Name => "Ianode";
    /// <summary>
    /// свойство.
    /// </summary>
    public override string? Curve2Name => "Iscreen";

    /// <summary>
    /// операция.
    /// </summary>
    public override GridCurvesBase ConvertToGridCurves()
    {
        return new PentodeGridCurves(
            pmaxWatt: PmaxWatt,
            measurementPoints: GetGridCurvesFromAnodeCurves(MeasurementPoints));
    }
}
