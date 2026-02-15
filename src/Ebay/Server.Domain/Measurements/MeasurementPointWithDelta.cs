namespace Server.Domain.Measurements;

/// <summary>
/// DTO-модель.
/// </summary>
public record MeasurementPointWithDelta(
    MeasurementPoint MeasurementPoint,
    double DeltaIa,
    double DeltaIs,
    double DeltaVg,
    double DeltaVa,
    double DeltaVs,
    double DeltaVf)
{
    /// <summary>
    /// свойство.
    /// </summary>
    public double Ia => MeasurementPoint.Ia;
    /// <summary>
    /// свойство.
    /// </summary>
    public double Is => MeasurementPoint.Is;
    /// <summary>
    /// свойство.
    /// </summary>
    public double Vg => MeasurementPoint.Vg;
    /// <summary>
    /// свойство.
    /// </summary>
    public double Va => MeasurementPoint.Va;
    /// <summary>
    /// свойство.
    /// </summary>
    public double Vs => MeasurementPoint.Vs;
    /// <summary>
    /// свойство.
    /// </summary>
    public double Vf => MeasurementPoint.Vf;
}
