using MassTransit;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Services;

namespace Server.Consumers;

internal class PriceCalculatorConsumer : IConsumer<ProductChanged>
{
    private readonly ApplicationDbContext _applicationContext;
    private readonly ILogger<PriceCalculatorConsumer> _logger;
    private readonly Dictionary<string, List<ShippingRatesService.ShippingRateInner>> _shippingRates;

    public PriceCalculatorConsumer(
        ApplicationDbContext applicationContext,
        ShippingRatesService shippingRatesService,
        ILogger<PriceCalculatorConsumer> logger)
    {
        _applicationContext = applicationContext;
        _logger = logger;
        _shippingRates = shippingRatesService.GetShippingRatesDictionary();
    }

    public async Task Consume(ConsumeContext<ProductChanged> context)
    {
        await RecalculateMeanPricesForProduct(context.Message.ProductId, context.CancellationToken);
    }


    private async Task RecalculateMeanPricesForProduct(Guid productId, CancellationToken cancellationToken)
    {
        var currencyRates = await _applicationContext.Currencies
            .AsNoTracking()
            .ToDictionaryAsync(x => x.CurrencyEbayName, x => x.CurrencyRate, cancellationToken);

        var product = await _applicationContext.Products
            .AsNoTracking()
            .Include(x => x.Lots)
            .ThenInclude(x => x.Purchases)
            .Include(product => product.Lots).ThenInclude(lot => lot.Currency)
            .SingleOrDefaultAsync(predicate: x => x.Id == productId, cancellationToken: cancellationToken);


        if (product == null) throw new NullReferenceException(nameof(product));

        // ReSharper disable IdentifierTypo
        const double скидкаНаПродажиСНеизвестнойЦеной = 0.2;
        const double коммисияEbayВПроцентах = 0.1325;
        const double коммиссияEbayПостояннаяВеличина = 0.1325;
        const double коммисияPayoneerВПроцентах = 0.05; //todo уточнить
        const double множительДляУчетаВесаУпаковки = 1.5;

        foreach (var lot in product.Lots)
        {
            var condition = lot.Condition;
            var testState = lot.ConditionDescription;

            foreach (var purchase in lot.Purchases)
            {
                var количествоШтукВПродаже = lot.Pcs * purchase.Quantity;

                var ценаДоставкиВДоллларах = GetShippingPrice(
                    shippingCountry: lot.ShippingCountry,
                    weight: product.Weight * количествоШтукВПродаже * множительДляУчетаВесаУпаковки,
                    currencyRates: currencyRates);

                var ценаЛотаВВалютеЛота = purchase.Price ?? lot.Price * (1.0 - скидкаНаПродажиСНеизвестнойЦеной);
                var ценаДоставкиВВалютеЛота = lot.Shipping + lot.ShippingAdditional * (purchase.Quantity - 1);

                var полнаяЦенаПродажиВВалютеЛота = ценаЛотаВВалютеЛота * purchase.Quantity + ценаДоставкиВВалютеЛота;

                var полнаяЦенаПродажиВДолларах = полнаяЦенаПродажиВВалютеЛота / currencyRates[lot.CurrencyId];

                var выручкаСПродажиВДолларах = полнаяЦенаПродажиВДолларах
                                               - полнаяЦенаПродажиВДолларах * коммисияEbayВПроцентах
                                               - коммиссияEbayПостояннаяВеличина
                                               - полнаяЦенаПродажиВДолларах * коммисияPayoneerВПроцентах
                                               - ценаДоставкиВДоллларах;

                var выручкаСПродажиЗаШтукуВДолларах = выручкаСПродажиВДолларах / количествоШтукВПродаже;
                
                var x = (
                    LotId: lot.Id,
                    Condition: condition,
                    TestState: testState,
                    ItemsInPurchase: количествоШтукВПродаже);
                _logger.LogInformation(x.ToString());
            }
        }
        // ReSharper restore IdentifierTypo

    }

    private double GetShippingPrice(string shippingCountry, double weight, Dictionary<string, double> currencyRates)
    {
        if (!_shippingRates.TryGetValue(key: shippingCountry, value: out var shippingRates))
        {
            throw new InvalidOperationException($"{shippingCountry} not found in shippingRates");
        }

        var prices = _shippingRates[ShippingRatesService.Worldwide].Concat(shippingRates).ToList();

        try
        {
            return prices.Where(x => x.WeightFrom <= weight && weight <= x.WeightTo)
                .Select(x => x.Price / currencyRates[x.Currency]).Min(x => x);
        }
        catch (Exception)
        {
            var pricesString = string.Join(", ", prices);
            _logger.LogError(
                $"Error while calculating shipping price for {shippingCountry}, and weight {weight}, prices: '{pricesString}'");

            throw;
        }

    }
}

public record ProductChanged(Guid ProductId);
