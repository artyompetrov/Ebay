using System.Diagnostics;
using Microsoft.Extensions.Logging;
using OneOf;
using OneOf.Types;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Domain;
using Server.Domain.Errors;
using Server.Domain.Shipping;

namespace Server.Application.PriceCalculator;

/// <summary>
/// Выполняет расчет цен и выручки для лота и его покупок.
/// </summary>
public sealed class LotPriceCalculator : ILotPriceCalculator
{
    private readonly ILotRepository _lotRepository;
    private readonly IProductQueries _productQueries;
    private readonly ICurrencyQueries _currencyQueries;
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;
    private readonly ILogger<LotPriceCalculator> _logger;

    /// <summary>
    /// Создает сервис расчета цен лота.
    /// </summary>
    public LotPriceCalculator(
        ILotRepository lotRepository,
        IProductQueries productQueries,
        ICurrencyQueries currencyQueries,
        IWriteModelUnitOfWorkFactory unitOfWorkFactory,
        ILogger<LotPriceCalculator> logger)
    {
        _lotRepository = lotRepository;
        _productQueries = productQueries;
        _currencyQueries = currencyQueries;
        _unitOfWorkFactory = unitOfWorkFactory;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<OneOf<Guid, NotFound, DomainError>> CalculateAsync(long lotId, CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        _logger.LogInformation("Calculation started for {LotId}", lotId);

        var lot = await _lotRepository.GetByIdAsync(unitOfWork, lotId, cancellationToken);
        if (lot is null)
        {
            _logger.LogWarning("Lot {LotId} not found, calculation skipped", lotId);
            return new NotFound();
        }

        // A lot references its product with a restricting foreign key, so the product can't be gone.
        var product = await _productQueries.GetProductAsync(lot.ProductId, cancellationToken) ??
                      throw new UnreachableException($"Product {lot.ProductId} of lot {lotId} not found");

        var currencyRates = await _currencyQueries.GetCurrencyRatesAsync(cancellationToken);

        var currentDate = DateTimeOffset.UtcNow;

        // ReSharper disable IdentifierTypo

        var общееКоличествоШтукВоВсехПродажах = 0;
        var общаяВыручкаВДолларах = 0.0;
        var общаяПолнаяЦенаПродажиВДолларахЗаВычетомДоставки = 0.0;

        foreach (var purchase in lot.Purchases)
        {
            var количествоШтукВПродаже = lot.Pcs * purchase.Quantity;

            var shippingPrice = GetShippingPrice(
                shippingCountry: lot.ShippingCountry,
                weight: product.Weight * количествоШтукВПродаже * WellKnown.EbayWeightMultiplier,
                currencyRates: currencyRates);
            if (shippingPrice.TryPickT1(out var shippingPriceError, out var рассчетнаяЦенаДоставкиВДоллларахИзКазахстана))
            {
                _logger.LogError(
                    "Calculation failed for {LotId}: {Error}",
                    lotId,
                    shippingPriceError.Message);
                return shippingPriceError;
            }

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

        await unitOfWork.SaveChangesAsync(cancellationToken);
        // ReSharper restore IdentifierTypo

        return lot.ProductId;
    }

    private OneOf<double, DomainError> GetShippingPrice(string shippingCountry, double weight, IReadOnlyDictionary<string, double> currencyRates)
    {
        var shippingRatesDictionary = ShippingRatesTable.ShippingRatesDictionary;
        if (!shippingRatesDictionary.TryGetValue(key: shippingCountry, value: out var shippingRates))
        {
            return new DomainError($"{shippingCountry} not found in shippingRates");
        }

        var prices = shippingRatesDictionary[ShippingRatesTable.Worldwide].Concat(shippingRates).ToList();

        var matchingPrices = prices
            .Where(x => x.WeightFrom <= weight && weight <= x.WeightTo)
            .Select(x => x.Price / currencyRates[x.Currency])
            .ToList();

        if (matchingPrices.Count == 0)
        {
            var pricesString = string.Join(", ", prices);
            _logger.LogError(
                "Error while calculating shipping price for {ShippingCountry}, and weight {Weight}, prices: '{PricesString}'",
                shippingCountry,
                weight,
                pricesString);

            return new DomainError($"No shipping rate to {shippingCountry} for weight {weight}");
        }

        return matchingPrices.Min();
    }
}
