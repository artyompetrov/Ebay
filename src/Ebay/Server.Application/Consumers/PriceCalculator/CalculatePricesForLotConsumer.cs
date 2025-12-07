using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Application.Data;
using Server.Application.Infrastructure;
using Server.Application.Services.LotDataExtractor;
using Server.Domain;

namespace Server.Application.Consumers.PriceCalculator;

internal class CalculatePricesForLotConsumer : IConsumer<CalculatePricesForLot>
{
    private readonly ApplicationDbContext _applicationContext;
    private readonly ILogger<CalculatePricesForProductConsumer> _logger;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IReadOnlyDictionary<string, List<ShippingRatesService.ShippingRateInner>> _shippingRates;

    public CalculatePricesForLotConsumer(
        ApplicationDbContext applicationContext,
        ShippingRatesService shippingRatesService,
        ILogger<CalculatePricesForProductConsumer> logger,
        IPublishEndpoint publishEndpoint)
    {
        _applicationContext = applicationContext;
        _logger = logger;
        _publishEndpoint = publishEndpoint;
        _shippingRates = shippingRatesService.ShippingRatesDictionary;
    }

    public async Task Consume(ConsumeContext<CalculatePricesForLot> context)
    {

        _logger.LogInformation(
            "Calculation started for {LotId}",
            context.Message.LotId);

        var currentDate = DateTime.UtcNow;
        using var transaction = TransactionScopeFactory.Create();

        var currencyRates = await _applicationContext.Currencies
            .AsNoTracking()
            .ToDictionaryAsync(x => x.CurrencyEbayName, x => x.CurrencyRate, context.CancellationToken);

        var lot = await _applicationContext.Lots.Include(lot => lot.Purchases)
                      .SingleOrDefaultAsync(x => x.Id == context.Message.LotId) ??
                  throw new InvalidOperationException($"Lot with {context.Message.LotId} not found");
        var product =
            await _applicationContext.Products.AsNoTracking().SingleOrDefaultAsync(x => x.Id == lot.ProductId) ??
            throw new InvalidOperationException($"Product with {lot.ProductId} not found");

        // ReSharper disable IdentifierTypo


        var общееКоличествоШтукВоВсехПродажах = 0;
        var общаяВыручкаВДолларах = 0.0;
        var общаяПолнаяЦенаПродажиВДолларахЗаВычетомДоставки = 0.0;

        foreach (var purchase in lot.Purchases)
        {
            var количествоШтукВПродаже = lot.Pcs * purchase.Quantity;

            var рассчетнаяЦенаДоставкиВДоллларахИзКазахстана = GetShippingPrice(
                shippingCountry: lot.ShippingCountry,
                weight: product.Weight * количествоШтукВПродаже * WellKnown.Ebay.множительДляУчетаВесаУпаковки,
                currencyRates: currencyRates);

            var ценаЛотаВВалютеЛота = purchase.Price ?? lot.Price * (1.0 - WellKnown.Ebay.скидкаНаПродажиСНеизвестнойЦеной);
            var ценаДоставкиВВалютеЛота = lot.Shipping + lot.ShippingAdditional * (purchase.Quantity - 1);

            var полнаяЦенаПродажиВВалютеЛота = ценаЛотаВВалютеЛота * purchase.Quantity + ценаДоставкиВВалютеЛота;

            var полнаяЦенаПродажиВДолларах = полнаяЦенаПродажиВВалютеЛота / currencyRates[lot.CurrencyId];

            var ebayFinalValueFee = полнаяЦенаПродажиВДолларах * WellKnown.Ebay.коммисияEbayFinalValueFee;
            var ebayInternationalFee = полнаяЦенаПродажиВДолларах * WellKnown.Ebay.коммисияEbayInternationalFee;
            var ebayFee = (ebayFinalValueFee + ebayInternationalFee + WellKnown.Ebay.коммиссияEbayПостояннаяВеличина) *
                          WellKnown.Ebay.множительУчитывающийVat;

            var полнаяЦенаПродажиЗаВычетомКоммиссийEbay = полнаяЦенаПродажиВДолларах - ebayFee;

            var payoneerFee = полнаяЦенаПродажиЗаВычетомКоммиссийEbay * WellKnown.Ebay.коммисияPayoneerВПроцентах;

            var выручкаСПродажиВДолларах = полнаяЦенаПродажиЗаВычетомКоммиссийEbay
                                           - payoneerFee
                                           - рассчетнаяЦенаДоставкиВДоллларахИзКазахстана;

            var полнаяЦенаПродажиВДолларахЗаВычетомДоставки =
                полнаяЦенаПродажиВДолларах - рассчетнаяЦенаДоставкиВДоллларахИзКазахстана;

            общееКоличествоШтукВоВсехПродажах += количествоШтукВПродаже;
            общаяВыручкаВДолларах += выручкаСПродажиВДолларах;
            общаяПолнаяЦенаПродажиВДолларахЗаВычетомДоставки += полнаяЦенаПродажиВДолларахЗаВычетомДоставки;

            purchase.PurchaseCalculationResult = new PurchaseCalculationResult
            {
                Revenue = выручкаСПродажиВДолларах,
                QuantityTotal = количествоШтукВПродаже,
                ListingPrice = полнаяЦенаПродажиВДолларахЗаВычетомДоставки,
                CalculationDate = currentDate
            };

        }


        lot.LotCalculationResult = new LotCalculationResult
        {
            Revenue = общаяВыручкаВДолларах,
            QuantityTotal = общееКоличествоШтукВоВсехПродажах,
            ListingPriceSumm = общаяПолнаяЦенаПродажиВДолларахЗаВычетомДоставки,
            CalculationDate = currentDate
        };


        await _publishEndpoint.Publish(
            new CalculateTotalAveragePriceForProduct(lot.ProductId),
            context.CancellationToken);

        _ = await _applicationContext.SaveChangesAsync(context.CancellationToken);
        // ReSharper restore IdentifierTypo

        transaction.Complete();
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
                "Error while calculating shipping price for {ShippingCountry}, and weight {Weight}, prices: '{PricesString}'",
                shippingCountry,
                weight,
                pricesString);

            throw;
        }

    }
}

public record CalculatePricesForLot(long LotId);