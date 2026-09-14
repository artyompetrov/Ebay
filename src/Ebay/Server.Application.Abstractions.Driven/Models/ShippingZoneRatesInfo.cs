namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Weight-bracket rates for one shipping zone, either worldwide (<paramref name="SpecifiedCountries"/> is
/// <see langword="null"/>) or for a specific set of destination countries.
/// </summary>
public record ShippingZoneRatesInfo(
    int? PostZone,
    IReadOnlyCollection<ShippingCountryInfo>? SpecifiedCountries,
    IReadOnlyCollection<ShippingRateInfo> Rates
);
