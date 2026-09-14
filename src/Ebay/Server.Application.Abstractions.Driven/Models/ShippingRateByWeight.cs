namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// A shipping price for one weight bracket to a specific destination (or worldwide), flattened for lookup.
/// </summary>
public record ShippingRateByWeight(int WeightFrom, int WeightTo, double Price, string Currency)
{
    public override string ToString() => $"{WeightFrom}-{WeightTo} : {Price} {Currency}";
}
