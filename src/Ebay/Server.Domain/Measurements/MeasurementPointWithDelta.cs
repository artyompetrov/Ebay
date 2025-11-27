namespace Server.Domain.Measurements;

public record MeasurementPointWithDelta(
    MeasurementPoint MeasurementPoint,
    double DeltaIa,
    double DeltaIs,
    double DeltaVg,
    double DeltaVa,
    double DeltaVs,
    double DeltaVf)
{
    public double Ia => MeasurementPoint.Ia;
    public double Is => MeasurementPoint.Is;
    public double Vg => MeasurementPoint.Vg;
    public double Va => MeasurementPoint.Va;
    public double Vs => MeasurementPoint.Vs;
    public double Vf => MeasurementPoint.Vf;
}