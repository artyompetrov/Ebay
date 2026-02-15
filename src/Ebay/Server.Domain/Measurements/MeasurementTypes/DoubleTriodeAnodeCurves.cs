using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.MeasurementTypes;

/// <summary>
/// класс доменной модели.
/// </summary>
public class DoubleTriodeAnodeCurves : AnodeCurvesBase
{
    /// <summary>
    /// операция.
    /// </summary>
    public DoubleTriodeAnodeCurves(double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints)
        : base(
            pmaxWatt: pmaxWatt,
            measurementPoints: measurementPoints,
            takeMeasurementPointsWhile: (x, maxI) => x.DeltaIa / maxI > IgnoreDi && x.DeltaIs / maxI > IgnoreDi)
    {
    }

    /// <summary>
    /// свойство.
    /// </summary>
    public override string Curve1Name => "Section 1";
    /// <summary>
    /// свойство.
    /// </summary>
    public override string? Curve2Name => "Section 2";

    /// <summary>
    /// операция.
    /// </summary>
    public override GridCurvesBase ConvertToGridCurves()
    {
        return new DoubleTriodeGridCurves(
            pmaxWatt: PmaxWatt,
            measurementPoints: GetGridCurvesFromAnodeCurves(MeasurementPoints));
    }
}
