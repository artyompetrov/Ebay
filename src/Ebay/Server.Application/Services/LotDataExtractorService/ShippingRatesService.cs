using Server.Application.Infrastructure;
using Server.Controllers.Generated;

namespace Server.Application.Services.LotDataExtractorService;

public class ShippingRatesService
{
    private readonly List<ShippingType> _rates;
    private readonly Dictionary<string, List<ShippingRateInner>> _shippingRatesDictionary;

    // тарифы взяты отсюда https://qazpost.kz/ru/help/tariffs?tab=pochtovye-uslugi

    public ShippingRatesService()
    {
        _rates = new List<ShippingType>
        {
            new(
                name: "Мелкий пакет авиа",
                currency: WellKnown.Currencies.KZT,
                rates: new List<ShippingRates>
                {
                    new(
                        rates: new List<ShippingRate>
                        {
                            new(minWeight: 0, maxWeight: 500, price: 8_960),
                            new(minWeight: 500, maxWeight: 1000, price: 15_400),
                            new(minWeight: 1000, maxWeight: 2000, price: 27_462),
                        },
                        specifiedCountries: null
                    )
                }
            ),
            new(
                name: "Посылка авиа",
                currency: WellKnown.Currencies.KZT,
                rates: new List<ShippingRates>
                {
                    new( // 3
                        rates: new List<ShippingRate>
                        {
                            new(minWeight: 0, maxWeight: 2000, price: 16_950),
                            new(minWeight: 2000, maxWeight: 3000, price: 24_225),
                            new(minWeight: 3000, maxWeight: 4000, price: 30_825),
                            new(minWeight: 4000, maxWeight: 5000, price: 37_725),
                            new(minWeight: 5000, maxWeight: 6000, price: 44_400),
                            new(minWeight: 6000, maxWeight: 7000, price: 51_150),
                            new(minWeight: 7000, maxWeight: 8000, price: 57_900),
                            new(minWeight: 8000, maxWeight: 9000, price: 64_875),
                            new(minWeight: 9000, maxWeight: 10000, price: 71_400),
                        }.Concat(
                            Enumerable.Range(10, 30).Select(x => new ShippingRate(
                                minWeight: x * 1000,
                                maxWeight: (x + 1) * 1000,
                                price: 71_400 + (x - 9) * 6_600
                            ))
                        ).ToList(),
                        specifiedCountries: new List<string>()
                        {
                            "DE",
                            "IT",
                            "FR",
                            "GB",
                            "PL",
                            "RO",
                            "SK",
                            "EE",
                            "LT",
                            "BG",
                            "LV"
                        }
                    ),
                    new( //4
                        rates: new List<ShippingRate>
                        {
                            new(minWeight: 0, maxWeight: 2000, price: 17_175),
                            new(minWeight: 2000, maxWeight: 3000, price: 26_475),
                            new(minWeight: 3000, maxWeight: 4000, price: 35_175),
                            new(minWeight: 4000, maxWeight: 5000, price: 44_100),
                            new(minWeight: 5000, maxWeight: 6000, price: 52_650),
                            new(minWeight: 6000, maxWeight: 7000, price: 61_125),
                            new(minWeight: 7000, maxWeight: 8000, price: 70_200),
                            new(minWeight: 8000, maxWeight: 9000, price: 78_450),
                            new(minWeight: 9000, maxWeight: 10000, price: 87_150),
                        }.Concat(
                            Enumerable.Range(10, 30).Select(x => new ShippingRate(
                                minWeight: x * 1000,
                                maxWeight: (x + 1) * 1000,
                                price: 87_150 + (x - 9) * 7_920
                            ))
                        ).ToList(),
                        specifiedCountries: new List<string> { "US", }
                    ),
                    new( //5
                        rates: new List<ShippingRate>
                        {
                            new(minWeight: 0, maxWeight: 2000, price: 19_800),
                            new(minWeight: 2000, maxWeight: 3000, price: 33_375),
                            new(minWeight: 3000, maxWeight: 4000, price: 45_975),
                            new(minWeight: 4000, maxWeight: 5000, price: 58_200),
                            new(minWeight: 5000, maxWeight: 6000, price: 70_500),
                            new(minWeight: 6000, maxWeight: 7000, price: 82_950),
                            new(minWeight: 7000, maxWeight: 8000, price: 95_700),
                            new(minWeight: 8000, maxWeight: 9000, price: 108_300),
                            new(minWeight: 9000, maxWeight: 10000, price: 120_600),
                        }.Concat(
                            Enumerable.Range(10, 30).Select(x => new ShippingRate(
                                minWeight: x * 1000,
                                maxWeight: (x + 1) * 1000,
                                price: 120_600 + (x - 9) * 11_325
                            ))
                        ).ToList(),
                        specifiedCountries: new List<string> { "AU", }
                    )
                }
            ),
        };

        _shippingRatesDictionary = GetShippingRatesDictionaryInner();
    }


    public const string Worldwide = "Worldwide";

    public IReadOnlyCollection<ShippingType> ShippingRates => _rates;

    public IReadOnlyDictionary<string, List<ShippingRateInner>> ShippingRatesDictionary => _shippingRatesDictionary;

    private Dictionary<string, List<ShippingRateInner>> GetShippingRatesDictionaryInner()
    {
        var rates = new Dictionary<string, List<ShippingRateInner>>();

        foreach (var shippingRate in ShippingRates)
        {
            foreach (var shippingRateRate in shippingRate.Rates)
            {
                if (shippingRateRate == null) throw new NullReferenceException(nameof(shippingRate));

                foreach (var rate in shippingRateRate.Rates)
                {
                    if (shippingRateRate.SpecifiedCountries == null)
                    {
                        rates.AppendOrCreateNewCollection(key: Worldwide, value: new ShippingRateInner(
                            WeightFrom: rate.MinWeight,
                            WeightTo: rate.MaxWeight,
                            Price: rate.Price,
                            Currency: shippingRate.Currency));
                    }
                    else
                    {
                        foreach (var specifiedCountry in shippingRateRate.SpecifiedCountries)
                        {
                            if (rate == null!) throw new NullReferenceException(nameof(rate));

                            rates.AppendOrCreateNewCollection(key: specifiedCountry, value: new ShippingRateInner(
                                WeightFrom: rate.MinWeight,
                                WeightTo: rate.MaxWeight,
                                Price: rate.Price,
                                Currency: shippingRate.Currency));
                        }
                    }
                }
            }
        }

        return rates;
    }


    public record struct ShippingRateInner(int WeightFrom, int WeightTo, double Price, string Currency)
    {
        public override string ToString() => $"{WeightFrom}-{WeightTo} : {Price} {Currency}";
    };

}