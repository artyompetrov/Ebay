namespace Server.Application.Abstractions.Models.ShippingRates;

public record ShippingRate(int WeightFrom, int WeightTo, double Price, string Currency)
{
    public override string ToString() => $"{WeightFrom}-{WeightTo} : {Price} {Currency}";
}