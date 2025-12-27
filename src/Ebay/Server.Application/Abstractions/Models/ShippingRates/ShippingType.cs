namespace Server.Application.Abstractions.Models.ShippingRates;

public record ShippingType(string Name, string Currency, IReadOnlyCollection<ShippingRates> Rates);