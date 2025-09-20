namespace Server.Application.Services.Measurement.QuickTest;

public record SectionTest(
    double Va,
    double Vg,
    double VaSwingPercent,
    double VgSwingPercent,
    double Ia,
    double IaNominal,
    double Ra,
    double RaNominal,
    double Gm,
    double GmNominal,
    double Mu,
    double MuNominal
);