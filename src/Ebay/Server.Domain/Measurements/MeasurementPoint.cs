namespace Server.Domain.Measurements
{
    public record MeasurementPoint(
        double Ia,
        double Is,
        double Vg,
        double Va,
        double Vs,
        double Vf
        );
}