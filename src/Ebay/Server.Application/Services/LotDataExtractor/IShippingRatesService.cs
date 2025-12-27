using Server.Application.Abstractions.Models;
using Server.Application.Abstractions.Models.ShippingRates;

namespace Server.Application.Services.LotDataExtractor;

public interface IShippingRatesService
{
    IReadOnlyCollection<ShippingType> ShippingRates { get; }

    IReadOnlyDictionary<string, List<ShippingRate>> ShippingRatesDictionary { get; }
}