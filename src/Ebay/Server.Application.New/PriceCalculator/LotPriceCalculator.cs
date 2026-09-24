using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Domain;
using Server.Domain.Shipping;

namespace Server.Application.New.PriceCalculator;

/// <summary>
/// Выполняет расчет цен и выручки для лота и его покупок.
/// </summary>
public sealed class LotPriceCalculator : ILotPriceCalculator
{
    private readonly ILotRepository _lotRepository;
    private readonly IProductQueries _productQueries;
    private readonly ICurrencyQueries _currencyQueries;
    private readonly IWriteModelUnitOfWork _unitOfWork;
    private readonly ILogger<LotPriceCalculator> _logger;

    /// <summary>
    /// Создает сервис расчета цен лота.
    /// </summary>
    public LotPriceCalculator(
        ILotRepository lotRepository,
        IProductQueries productQueries,
        ICurrencyQueries currencyQueries,
        IWriteModelUnitOfWork unitOfWork,
        ILogger<LotPriceCalculator> logger)
    {
        _lotRepository = lotRepository;
        _productQueries = productQueries;
        _currencyQueries = currencyQueries;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<Guid> CalculateAsync(long lotId, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Calculation started for {LotId}", lotId);

        var lot = await _lotRepository.GetByIdAsync(lotId, cancellationToken) ??
                  throw new InvalidOperationException($"Lot with {lotId} not found");

        var product =
            await _productQueries.GetProductAsync(lot.ProductId, cancellationToken) ??
            throw new InvalidOperationException($"Product with {lot.ProductId} not found");

        var currencyRates = await _currencyQueries.GetCurrencyRatesAsync(cancellationToken);

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
                weight: product.Weight * количествоШтукВПродаже * WellKnown.EbayWeightMultiplier,
                currencyRates: currencyRates);

            var ценаЛотаВВалютеЛота = purchase.Price ?? lot.Price * (1.0 - WellKnown.Ebay.НеизвестнаяЦенаПродажиСкидка);
            var ценаДоставкиВВалютеЛота = lot.Shipping + lot.ShippingAdditional * (purchase.Quantity - 1);

            var полнаяЦенаПродажиВВалютеЛота = ценаЛотаВВалютеЛота * purchase.Quantity + ценаДоставкиВВалютеЛота;

            var полнаяЦенаПродажиВДолларах = полнаяЦенаПродажиВВалютеЛота / currencyRates[lot.CurrencyId];

            var ebayFinalValueFee = полнаяЦенаПродажиВДолларах * WellKnown.Ebay.КомиссияEbayFinalValueFee;
            var ebayInternationalFee = полнаяЦенаПродажиВДолларах * WellKnown.Ebay.КомиссияEbayInternationalFee;
            var ebayFee = (ebayFinalValueFee + ebayInternationalFee + WellKnown.Ebay.КомиссияEbayПостояннаяВеличина) *
                          WellKnown.Ebay.МножительУчитывающийVat;

            var полнаяЦенаПродажиЗаВычетомКоммиссийEbay = полнаяЦенаПродажиВДолларах - ebayFee;

            var payoneerFee = полнаяЦенаПродажиЗаВычетомКоммиссийEbay * WellKnown.Ebay.КомиссияPayoneerВПроцентах;

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

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        // ReSharper restore IdentifierTypo

        return lot.ProductId;
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
