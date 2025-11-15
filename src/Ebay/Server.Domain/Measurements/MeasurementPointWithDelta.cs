namespace Server.Domain.Measurements
{
    public record MeasurementPointWithDelta(
        MeasurementPoint MeasurementPoint,
        double dIa,
        double dIs,
        double dVg,
        double dVa,
        double dVs,
        double dVf
    )
    {
        public double Ia => MeasurementPoint.Ia;
        public double Is => MeasurementPoint.Is;
        public double Vg => MeasurementPoint.Vg;
        public double Va => MeasurementPoint.Va;
        public double Vs => MeasurementPoint.Vs;
        public double Vf => MeasurementPoint.Vf;
    }
}