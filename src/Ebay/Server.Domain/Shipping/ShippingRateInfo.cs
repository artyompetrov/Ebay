namespace Server.Domain.Shipping;

/// <summary>
/// A shipping price for a weight bracket, in grams.
/// </summary>
public record ShippingRateInfo(int MinWeight, int MaxWeight, int Price);