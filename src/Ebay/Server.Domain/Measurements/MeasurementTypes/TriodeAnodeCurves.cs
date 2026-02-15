using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

/// <summary>
/// класс доменной модели.
/// </summary>
public class TriodeAnodeCurves : AnodeCurvesBase
{
    /// <summary>
    /// операция.
    /// </summary>
    public TriodeAnodeCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints)
        : base(
            pmaxWatt: pmaxWatt,
            measurementPoints: measurementPoints,
            takeMeasurementPointsWhile: (x, maxI) => x.DeltaIa / maxI > IgnoreDi)
    {
    }

    /// <summary>
    /// свойство.
    /// </summary>
    public override string Curve1Name => "Section 1";
    /// <summary>
    /// свойство.
    /// </summary>
    public override string? Curve2Name => null;

    /// <summary>
    /// операция.
    /// </summary>
    public override GridCurvesBase ConvertToGridCurves()
    {
        return new TriodeGridCurves(
            pmaxWatt: PmaxWatt,
            measurementPoints: GetGridCurvesFromAnodeCurves(MeasurementPoints));
    }
}
