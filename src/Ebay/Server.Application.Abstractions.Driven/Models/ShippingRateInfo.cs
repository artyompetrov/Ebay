namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// A shipping price for a weight bracket, in grams.
/// </summary>
public record ShippingRateInfo(int MinWeight, int MaxWeight, int Price);
