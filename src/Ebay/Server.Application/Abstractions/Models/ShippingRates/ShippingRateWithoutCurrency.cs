namespace Server.Application.Abstractions.Models.ShippingRates;

public record ShippingRateWithoutCurrency(int WeightFrom, int WeightTo, double Price);