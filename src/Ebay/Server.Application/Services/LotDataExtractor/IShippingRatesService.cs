using Server.Application.Abstractions.Models;
using Server.Controllers.Generated;

namespace Server.Application.Services.LotDataExtractor;

public interface IShippingRatesService
{
    IReadOnlyCollection<ShippingType> ShippingRates { get; }

    IReadOnlyDictionary<string, List<ShippingRate>> ShippingRatesDictionary { get; }
}