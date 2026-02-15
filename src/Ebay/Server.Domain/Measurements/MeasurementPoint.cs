namespace Server.Domain.Measurements;

/// <summary>
/// DTO-модель.
/// </summary>
public record MeasurementPoint(
    double Ia,
    double Is,
    double Vg,
    double Va,
    double Vs,
    double Vf
    );
