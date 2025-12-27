namespace Server.Application.Abstractions.Models.ShippingRates;

public record ShippingRates(int? PostZone, IReadOnlyCollection<Country>? SpecifiedCountries,  IReadOnlyCollection<ShippingRateWithoutCurrency> Rates);