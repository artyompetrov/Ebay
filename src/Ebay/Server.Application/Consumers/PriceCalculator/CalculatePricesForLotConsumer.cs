using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Infrastructure;
using Server.Domain;
using Server.Domain.Shipping;

namespace Server.Application.Consumers.PriceCalculator;

public class CalculatePricesForLotConsumer : IConsumer<CalculatePricesForLot>
{
    private readonly ILotRepository _lotRepository;
    private readonly IProductQueries _productQueries;
    private readonly ICurrencyQueries _currencyQueries;
    private readonly IWriteModelUnitOfWork _unitOfWork;
    private readonly ILogger<CalculatePricesForProductConsumer> _logger;
    private readonly IPublishEndpoint _publishEndpoint;

    public CalculatePricesForLotConsumer(
        ILotRepository lotRepository,
        IProductQueries productQueries,
        ICurrencyQueries currencyQueries,
        IWriteModelUnitOfWork unitOfWork,
        ILogger<CalculatePricesForProductConsumer> logger,
        IPublishEndpoint publishEndpoint)
    {
        _lotRepository = lotRepository;
        _productQueries = productQueries;
        _currencyQueries = currencyQueries;
        _unitOfWork = unitOfWork;
        _logger = logger;
        _publishEndpoint = publishEndpoint;
    }

    public async Task Consume(ConsumeContext<CalculatePricesForLot> context)
    {
        _logger.LogInformation(
            "Calculation started for {LotId}",
            context.Message.LotId);

        var lot = await _lotRepository.GetByIdAsync(context.Message.LotId, context.CancellationToken) ??
                  throw new InvalidOperationException($"Lot with {context.Message.LotId} not found");

        var product =
            await _productQueries.GetProductAsync(lot.ProductId, context.CancellationToken) ??
            throw new InvalidOperationException($"Product with {lot.ProductId} not found");

        var currencyRates = await _currencyQueries.GetCurrencyRatesAsync(context.CancellationToken);

        var currentDate = DateTimeOffset.UtcNow;

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

            purchase.SetCalculationResult(new PurchaseCalculationResult
            {
                Revenue = выручкаСПродажиВДолларах,
                QuantityTotal = количествоШтукВПродаже,
                ListingPrice = полнаяЦенаПродажиВДолларахЗаВычетомДоставки,
                CalculationDate = currentDate
            });
        }

        lot.SetCalculationResult(new LotCalculationResult
        {
            Revenue = общаяВыручкаВДолларах,
            QuantityTotal = общееКоличествоШтукВоВсехПродажах,
            ListingPriceSumm = общаяПолнаяЦенаПродажиВДолларахЗаВычетомДоставки,
            CalculationDate = currentDate
        });

        await _publishEndpoint.Publish(
            new CalculateMetricsForProduct(lot.ProductId),
            context.CancellationToken);

        await _unitOfWork.SaveChangesAsync(context.CancellationToken);
        // ReSharper restore IdentifierTypo
    }

    private double GetShippingPrice(string shippingCountry, double weight, IReadOnlyDictionary<string, double> currencyRates)
    {
        var shippingRatesDictionary = ShippingRatesTable.ShippingRatesDictionary;
        if (!shippingRatesDictionary.TryGetValue(key: shippingCountry, value: out var shippingRates))
        {
            throw new InvalidOperationException($"{shippingCountry} not found in shippingRates");
        }

        var prices = shippingRatesDictionary[ShippingRatesTable.Worldwide].Concat(shippingRates).ToList();

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
