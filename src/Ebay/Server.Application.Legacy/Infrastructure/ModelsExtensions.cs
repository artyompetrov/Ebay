using System.Globalization;
using Server.Application.Abstractions.Queries;
using Server.Application.Services.LotDataExtractor;
using Server.Controllers.Generated;
using Server.Domain;
using ApiCurrency = Server.Controllers.Generated.Currency;
using ApiMeasurementState = Server.Controllers.Generated.MeasurementState;
using DbCurrency = Server.Domain.Currency;
using DbLotCalculationResult = Server.Domain.LotCalculationResult;
using DbMeasurementState = Server.Domain.Measurements.MeasurementState;
using DbProductCalculationResult = Server.Domain.ProductCalculationResult;
using DbProductState = Server.Domain.Measurements.ProductState;
using DbPurchaseCalculationResult = Server.Domain.PurchaseCalculationResult;
using LotCalculationResult = Server.Controllers.Generated.LotCalculationResult;
using ProductCalculationResult = Server.Controllers.Generated.ProductCalculationResult;
using ProductState = Server.Controllers.Generated.ProductState;
using Purchase = Server.Domain.Purchase;
using PurchaseCalculationResult = Server.Controllers.Generated.PurchaseCalculationResult;
using RuSearchQuery = Server.Controllers.Generated.RuSearchQuery;
using SearchQuery = Server.Controllers.Generated.SearchQuery;
using TubeWorkingPoint = Server.Controllers.Generated.TubeWorkingPoint;

namespace Server.Application.Infrastructure;

internal static class ModelsExtensions
{
    public static ProductWithId ToApiProduct(this ProductInfo productInfo)
    {
        return new(
        id: productInfo.Id,
        name: productInfo.Name,
        searchQueries: [.. productInfo.SearchQueries.Select(x => x.ToApiSearchQuery())],
        ruSearchQueries: [.. productInfo.RuSearchQueries.Select(x => x.ToApiRuSearchQuery())],
        isCheckRequired: productInfo.IsCheckRequired,
        weight: productInfo.Weight,
        productCalculationResult: productInfo.CalculationResult.ToApiLotCalculationResult(),
        productRegex: productInfo.ProductRegex.ToString(),
        isInteresting: productInfo.GetIsInteresting(),
        calculatedEbayWeight: productInfo.CalculatedEbayWeight
    );
    }

    public static SearchQuery ToApiSearchQuery(this SearchQueryWithId searchQuery) => new(id: searchQuery.Id, query: searchQuery.Query);

    public static RuSearchQuery ToApiRuSearchQuery(this SearchQueryWithId searchQuery) => new(id: searchQuery.Id, query: searchQuery.Query);

    public static TubeWorkingPoint ToApiTubeWorkingPoint(this TubeWorkingPointInfo workingPoint)
    {
        return new(
        anodeVoltage: workingPoint.AnodeVoltage,
        gridVoltage: workingPoint.GridVoltage,
        anodeVoltageHalfWidth: workingPoint.AnodeVoltageHalfWidth,
        gridVoltageHalfWidth: workingPoint.GridVoltageHalfWidth,
        nominalCurrent: workingPoint.NominalCurrent
    );
    }

    public static LotInfoWithProductId ToApiLot(this Lot lot)
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
            purchaseHistory: [.. lot.Purchases.OrderByDescending(x => x.Date).Select(x => x.ToApiPurchaseInfo(lot.TitleChangeDate))],
            seller: lot.Seller,
            titleChangeDate: lot.TitleChangeDate.ToString(WellKnown.Formats.TimeFormat, CultureInfo.InvariantCulture),
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
        purchaseHistory: [.. lot.Purchases.OrderByDescending(x => x.Date).Select(x => x.ToApiPurchaseInfo(lot.TitleChangeDate))],
        seller: lot.Seller,
        shipping: lot.Shipping,
        titleChangeDate: lot.TitleChangeDate.ToString(WellKnown.Formats.TimeFormat, CultureInfo.InvariantCulture),
        shippingAdditional: lot.ShippingAdditional,
        shortDescription: lot.ShortDescription,
        lotCalculationResult: lot.LotCalculationResult.ToApiLotCalculationResult()
    );
    }

    public static ProductCalculationResult? ToApiLotCalculationResult(this DbProductCalculationResult? productCalculationResult)
    {
        return productCalculationResult == null ? null : new(
        quantityTotal: productCalculationResult.QuantityTotal,
        revenue: productCalculationResult.Revenue,
        revenueAvg: productCalculationResult.RevenueAvg,
        calculationDate: productCalculationResult.CalculationDate.ToString("dd-MM-yy", CultureInfo.InvariantCulture),
        listingPriceAvg: productCalculationResult.ListingPriceAvg
    );
    }

    public static LotCalculationResult? ToApiLotCalculationResult(this DbLotCalculationResult? lotCalculationResult)
    {
        return lotCalculationResult == null ? null : new(
        quantityTotal: lotCalculationResult.QuantityTotal,
        revenue: lotCalculationResult.Revenue,
        revenueAvg: lotCalculationResult.RevenueAvg,
        calculationDate: lotCalculationResult.CalculationDate.ToString("dd-MM-yy", CultureInfo.InvariantCulture),
        listingPriceAvg: lotCalculationResult.ListingPriceAvg
    );
    }

    public static PurchaseCalculationResult? ToApiPurchaseCalculationResult(this DbPurchaseCalculationResult? lotCalculationResult)
    {
        return lotCalculationResult == null ? null : new(
        quantityTotal: lotCalculationResult.QuantityTotal,
        revenue: lotCalculationResult.Revenue,
        revenueAvg: lotCalculationResult.RevenueAvg,
        listingPriceAvg: lotCalculationResult.ListingPriceAvg
    );
    }

    public static PurchaseInfo ToApiPurchaseInfo(this Purchase purchase, DateTime titleChangeDate)
    {
        return new(
        date: purchase.Date.ToString(WellKnown.Formats.TimeFormat, CultureInfo.InvariantCulture),
        price: purchase.Price,
        quantity: purchase.Quantity,
        purchaseCalculationResult: purchase.PurchaseCalculationResult.ToApiPurchaseCalculationResult(),
        isRecent: titleChangeDate < purchase.Date
    );
    }

    public static Lot ToDbLot(this LotInfo lotInfo, Guid productId, DateTime updateDate)
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

    public static Purchase ToDbPurchase(this PurchaseInfo purchaseInfo, long lotId)
    {
        return new()
        {
            LotId = lotId,
            Date = DateTime.Parse(purchaseInfo.Date, CultureInfo.InvariantCulture).ToUniversalTime(),
            Price = purchaseInfo.Price,
            Quantity = purchaseInfo.Quantity
        };
    }

    public static ClientError ToDbClientError(this ClientErrorInfo error)
    {
        return new()
        {
            Url = error.Url,
            ErrorText = error.Error
        };
    }

    public static ApiCurrency ToApiCurrency(this DbCurrency currency)
    {
        return new(
        ebayName: currency.CurrencyEbayName,
        rusName: currency.CurrencyRusName,
        rate: currency.CurrencyRate,
        lastUpdate: currency.LastUpdate.ToString(WellKnown.Formats.TimeFormat, CultureInfo.InvariantCulture)
    );
    }

    public static ICollection<ExtractedFields> ToApiExtractedData(
        this Dictionary<string, Dictionary<string, HashSet<ExtractionResult>>> extractionResult
    )
    {
        return [.. extractionResult.Select(z => new ExtractedFields(
            extractedData: [.. z.Value.OrderByDescending(x => x.Value.Count)
                .Select(
                    x => new LotDataExtractedItem(
                        extractorInfo: [.. x.Value.Select(y => new ExtractorInfo(extractedFrom: y.ExtractedFrom.ToString(), extractor: y.Extractor, match: y.Match))],
                        value: x.Key
                    )
                )],
            fieldName: z.Key
        ))];
    }

    public static ProductState ToApiProductState(this DbProductState productState)
    {
        return productState switch
        {
            DbProductState.New => ProductState.New,
            DbProductState.Used => ProductState.Used,
            _ => throw new ArgumentOutOfRangeException(paramName: nameof(productState), actualValue: productState, message: null)
        };
    }

    public static DbProductState ToDbProductState(this ProductState productState)
    {
        return productState switch
        {
            ProductState.New => DbProductState.New,
            ProductState.Used => DbProductState.Used,
            _ => throw new ArgumentOutOfRangeException(nameof(productState), productState, null)
        };
    }

    public static ApiMeasurementState ToApiMeasurementState(this DbMeasurementState state)
    {
        return state switch
        {
            DbMeasurementState.Created => ApiMeasurementState.Created,
            DbMeasurementState.Selling => ApiMeasurementState.Selling,
            DbMeasurementState.Sold => ApiMeasurementState.Sold,
            _ => throw new ArgumentOutOfRangeException(nameof(state), state, null)
        };
    }

    public static DbMeasurementState ToDbMeasurementState(this ApiMeasurementState state)
    {
        return state switch
        {
            ApiMeasurementState.Created => DbMeasurementState.Created,
            ApiMeasurementState.Selling => DbMeasurementState.Selling,
            ApiMeasurementState.Sold => DbMeasurementState.Sold,
            _ => throw new ArgumentOutOfRangeException(nameof(state), state, null)
        };
    }
}