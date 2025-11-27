using Server.Controllers.Generated;

namespace Server.Application.Services.LotDataExtractor;

public interface IShippingRatesService
{
    IReadOnlyCollection<ShippingType> ShippingRates { get; }

    public IReadOnlyDictionary<string, List<ShippingRatesService.ShippingRateInner>> ShippingRatesDictionary { get; }
}
