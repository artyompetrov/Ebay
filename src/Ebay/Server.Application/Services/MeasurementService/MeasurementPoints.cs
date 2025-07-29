// ReSharper disable InconsistentNaming
namespace Server.Application.Services.MeasurementService;

public record MeasurementPoint(
    double Ia,
    double Is,
    double Vg,
    double Va,
    double Vs,
    double Vf,
    double dIa,
    double dIs,
    double dVg,
    double dVa,
    double dVs,
    double dVf);