using System.Globalization;
using Server.Application.Abstractions.Queries;
using Server.Application.Abstractions.Queries.Currencies;
using Server.Application.Services.LotDataExtractor;
using Server.Controllers.Generated;
using Server.Domain;

namespace Server.Adapters.Web;

internal static class ModelsExtensions
{
    public static ProductWithId ToApi(this ProductInfo productInfo)
    {
        return new(
            id: productInfo.Id,
            name: productInfo.Name,
            searchQueries: [.. productInfo.SearchQueries.Select(x => x.ToApiSearchQuery())],
            ruSearchQueries: [.. productInfo.RuSearchQueries.Select(x => x.ToApiRuSearchQuery())],
            isCheckRequired: productInfo.IsCheckRequired,
            weight: productInfo.Weight,
            productCalculationResult: productInfo.CalculationResult.ToApi(),
            productRegex: productInfo.ProductRegex.ToString(),
            isInteresting: productInfo.GetIsInteresting(),
            calculatedEbayWeight: productInfo.CalculatedEbayWeight
        );
    }

    public static Server.Controllers.Generated.SearchQuery ToApiSearchQuery(this SearchQueryWithId searchQuery) =>
        new(id: searchQuery.Id, query: searchQuery.Query);

    public static RuSearchQuery ToApiRuSearchQuery(this SearchQueryWithId searchQuery) =>
        new(id: searchQuery.Id, query: searchQuery.Query);

    public static TubeWorkingPoint ToApi(this TubeWorkingPointInfo workingPoint)
    {
        return new(
            anodeVoltage: workingPoint.AnodeVoltage,
            gridVoltage: workingPoint.GridVoltage,
            anodeVoltageHalfWidth: workingPoint.AnodeVoltageHalfWidth,
            gridVoltageHalfWidth: workingPoint.GridVoltageHalfWidth,
            nominalCurrent: workingPoint.NominalCurrent
        );
    }

    public static LotInfoWithProductId ToApiLotInfoWithProductId(this Lot lot)
    {
        return new(
            lotInfo: new(
                condition: lot.Condition,
                conditionDescription: lot.ConditionDescription,
                description: lot.Description,
                locatedIn: lot.LocatedIn,
                lotId: lot.Id,
                categories: [.. lot.Categories.Select(x => new CategoryValue(type: x.Key, value: x.Value))],
                name: lot.Name,
                shippingCountry: lot.ShippingCountry,
                pcs: lot.Pcs,
                currency: lot.CurrencyId,
                price: lot.Price,
                purchaseHistory:
                [.. lot.Purchases.OrderByDescending(x => x.Date).Select(x => x.ToApi(lot.TitleChangeDate))],
                seller: lot.Seller,
                titleChangeDate: lot.TitleChangeDate.ToString(
                    WellKnown.Formats.TimeFormat,
                    CultureInfo.InvariantCulture),
                shipping: lot.Shipping,
                shippingAdditional: lot.ShippingAdditional,
                shortDescription: lot.ShortDescription,
                lotSize: lot.LotSize
            ),
            productId: lot.ProductId
        );
    }

    public static LotInfoShort ToApiLotInfoShort(this Lot lot)
    {
        return new(
            condition: lot.Condition,
            conditionDescription: lot.ConditionDescription,
            locatedIn: lot.LocatedIn,
            lotId: lot.Id,
            categories: [.. lot.Categories.Select(x => new CategoryValue(type: x.Key, value: x.Value))],
            name: lot.Name,
            shippingCountry: lot.ShippingCountry,
            pcs: lot.Pcs,
            currency: lot.CurrencyId,
            price: lot.Price,
            purchaseHistory:
            [.. lot.Purchases.OrderByDescending(x => x.Date).Select(x => x.ToApi(lot.TitleChangeDate))],
            seller: lot.Seller,
            shipping: lot.Shipping,
            titleChangeDate: lot.TitleChangeDate.ToString(WellKnown.Formats.TimeFormat, CultureInfo.InvariantCulture),
            shippingAdditional: lot.ShippingAdditional,
            shortDescription: lot.ShortDescription,
            lotCalculationResult: lot.LotCalculationResult.ToApi()
        );
    }

    public static Server.Controllers.Generated.ProductCalculationResult? ToApi(
        this Domain.ProductCalculationResult? productCalculationResult)
    {
        return productCalculationResult == null
            ? null
            : new(
                quantityTotal: productCalculationResult.QuantityTotal,
                revenue: productCalculationResult.Revenue,
                revenueAvg: productCalculationResult.RevenueAvg,
                calculationDate: productCalculationResult.CalculationDate.ToString(
                    "dd-MM-yy",
                    CultureInfo.InvariantCulture),
                listingPriceAvg: productCalculationResult.ListingPriceAvg
            );
    }

    public static Server.Controllers.Generated.LotCalculationResult? ToApi(
        this Domain.LotCalculationResult? lotCalculationResult)
    {
        return lotCalculationResult == null
            ? null
            : new(
                quantityTotal: lotCalculationResult.QuantityTotal,
                revenue: lotCalculationResult.Revenue,
                revenueAvg: lotCalculationResult.RevenueAvg,
                calculationDate: lotCalculationResult.CalculationDate.ToString(
                    "dd-MM-yy",
                    CultureInfo.InvariantCulture),
                listingPriceAvg: lotCalculationResult.ListingPriceAvg
            );
    }

    public static Server.Controllers.Generated.PurchaseCalculationResult? ToApi(
        this Domain.PurchaseCalculationResult? lotCalculationResult)
    {
        return lotCalculationResult == null
            ? null
            : new(
                quantityTotal: lotCalculationResult.QuantityTotal,
                revenue: lotCalculationResult.Revenue,
                revenueAvg: lotCalculationResult.RevenueAvg,
                listingPriceAvg: lotCalculationResult.ListingPriceAvg
            );
    }

    public static PurchaseInfo ToApi(this Purchase purchase, DateTime titleChangeDate)
    {
        return new(
            date: purchase.Date.ToString(WellKnown.Formats.TimeFormat, CultureInfo.InvariantCulture),
            price: purchase.Price,
            quantity: purchase.Quantity,
            purchaseCalculationResult: purchase.PurchaseCalculationResult.ToApi(),
            isRecent: titleChangeDate < purchase.Date
        );
    }

    public static Lot ToApplication(this LotInfo lotInfo, Guid productId, DateTime updateDate)
    {
        return new()
        {
            ProductId = productId,
            Id = lotInfo.LotId,
            Name = lotInfo.Name,
            Pcs = lotInfo.Pcs,
            CurrencyId = lotInfo.Currency,
            ShippingCountry = lotInfo.ShippingCountry,
            Price = lotInfo.Price,
            Shipping = lotInfo.Shipping!.Value,
            ShippingAdditional = lotInfo.ShippingAdditional!.Value,
            Description = lotInfo.Description,
            Condition = lotInfo.Condition,
            ShortDescription = lotInfo.ShortDescription,
            ConditionDescription = lotInfo.ConditionDescription,
            Seller = lotInfo.Seller,
            LocatedIn = lotInfo.LocatedIn,
            Categories = lotInfo.Categories.ToDictionary(x => x.Type, x => x.Value),
            TitleChangeDate = DateTime.Parse(lotInfo.TitleChangeDate, CultureInfo.InvariantCulture).ToUniversalTime(),
            UpdateDate = updateDate,
            LotSize = lotInfo.LotSize
        };
    }

    public static Purchase ToApplication(this PurchaseInfo purchaseInfo, long lotId)
    {
        return new()
        {
            LotId = lotId,
            Date = DateTime.Parse(purchaseInfo.Date, CultureInfo.InvariantCulture).ToUniversalTime(),
            Price = purchaseInfo.Price,
            Quantity = purchaseInfo.Quantity
        };
    }

    public static Server.Controllers.Generated.Currency ToApi(this CurrencyDetailsReadModel currency)
    {
        return new(
            ebayName: currency.CurrencyEbayName,
            rusName: currency.CurrencyRusName,
            rate: currency.CurrencyRate,
            lastUpdate: currency.LastUpdate.ToString(WellKnown.Formats.TimeFormat, CultureInfo.InvariantCulture)
        );
    }

    public static ICollection<ExtractedFields> ToApi(
        this Dictionary<string, Dictionary<string, HashSet<ExtractionResult>>> extractionResult
    )
    {
        return
        [
            .. extractionResult.Select(z => new ExtractedFields(
                extractedData:
                [
                    .. z.Value.OrderByDescending(x => x.Value.Count)
                        .Select(x => new LotDataExtractedItem(
                                extractorInfo:
                                [
                                    .. x.Value.Select(y => new ExtractorInfo(
                                        extractedFrom: y.ExtractedFrom.ToString(),
                                        extractor: y.Extractor,
                                        match: y.Match))
                                ],
                                value: x.Key
                            )
                        )
                ],
                fieldName: z.Key
            ))
        ];
    }

    public static ProductState ToApi(this Server.Domain.Measurements.ProductState productState)
    {
        return productState switch
        {
            Domain.Measurements.ProductState.New => ProductState.New,
            Domain.Measurements.ProductState.Used => ProductState.Used,
            _ => throw new ArgumentOutOfRangeException(
                paramName: nameof(productState),
                actualValue: productState,
                message: null)
        };
    }

    public static Domain.Measurements.ProductState ToApplication(this ProductState productState)
    {
        return productState switch
        {
            ProductState.New => Domain.Measurements.ProductState.New,
            ProductState.Used => Domain.Measurements.ProductState.Used,
            _ => throw new ArgumentOutOfRangeException(nameof(productState), productState, null)
        };
    }

    public static Server.Controllers.Generated.MeasurementState ToApi(
        this Server.Domain.Measurements.MeasurementState state)
    {
        return state switch
        {
            Server.Domain.Measurements.MeasurementState.Created =>
                Server.Controllers.Generated.MeasurementState.Created,
            Server.Domain.Measurements.MeasurementState.Selling =>
                Server.Controllers.Generated.MeasurementState.Selling,
            Server.Domain.Measurements.MeasurementState.Sold => Server.Controllers.Generated.MeasurementState.Sold,
            _ => throw new ArgumentOutOfRangeException(nameof(state), state, null)
        };
    }

    public static Server.Domain.Measurements.MeasurementState ToApplication(
        this Server.Controllers.Generated.MeasurementState state)
    {
        return state switch
        {
            Server.Controllers.Generated.MeasurementState.Created =>
                Server.Domain.Measurements.MeasurementState.Created,
            Server.Controllers.Generated.MeasurementState.Selling =>
                Server.Domain.Measurements.MeasurementState.Selling,
            Server.Controllers.Generated.MeasurementState.Sold => Server.Domain.Measurements.MeasurementState.Sold,
            _ => throw new ArgumentOutOfRangeException(nameof(state), state, null)
        };
    }

    public static CategoryType ToApi(this Server.Application.Abstractions.Models.EbayLots.CategoryType category) => new(
        category.Items.Select(x => x.ToApi()).ToList(),
        category.Type);

    public static CategoryItem ToApi(this Application.Abstractions.Models.EbayLots.Category category) =>
        new(category.Description, category.Id);


    public static ShippingType ToApi(this Server.Application.Abstractions.Models.ShippingRates.ShippingType type) =>
        new(type.Currency, type.Name, type.Rates.Select(x=>x.ToApi()).ToList());

    public static ShippingRates ToApi(this Server.Application.Abstractions.Models.ShippingRates.ShippingRates rate) =>
        new(
            rate.PostZone,
            rate.Rates.Select(x => x.ToApi()).ToList(),
            rate.SpecifiedCountries?.Select(x => x.ToApi()).ToList());


    public static ShippingRate ToApi(
        this Server.Application.Abstractions.Models.ShippingRates.ShippingRateWithoutCurrency rateWithoutCurrency) =>
        new(rateWithoutCurrency.WeightFrom, rateWithoutCurrency.WeightTo, rateWithoutCurrency.Price);

    public static ShippingCountry ToApi(this Server.Application.Abstractions.Models.ShippingRates.Country country) =>
        new(
            twoLetterCode: country.TwoLetterCode,
            threeLetterCode: country.ThreeLetterCode,
            nameRu: country.RuName
        );
}