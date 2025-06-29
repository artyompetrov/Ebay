using Server.Application.Data.Models;
using Server.Application.Services;
using Server.Controllers.Generated;
using ApiCurrency = Server.Controllers.Generated.Currency;
using DbCurrency = Server.Application.Data.Models.Currency;
using DbLotCalculationResult = Server.Application.Data.Models.LotCalculationResult;
using DbProduct = Server.Application.Data.Models.Product;
using DbProductCalculationResult = Server.Application.Data.Models.ProductCalculationResult;
using DbProductState = Server.Application.Data.Models.ProductState;
using DbPurchaseCalculationResult = Server.Application.Data.Models.PurchaseCalculationResult;
using DbRuSearchQuery = Server.Application.Data.Models.RuSearchQuery;
using DbSearchQuery = Server.Application.Data.Models.SearchQuery;
using LotCalculationResult = Server.Controllers.Generated.LotCalculationResult;
using ProductCalculationResult = Server.Controllers.Generated.ProductCalculationResult;
using ProductState = Server.Controllers.Generated.ProductState;
using Purchase = Server.Application.Data.Models.Purchase;
using PurchaseCalculationResult = Server.Controllers.Generated.PurchaseCalculationResult;
using RuSearchQuery = Server.Controllers.Generated.RuSearchQuery;
using SearchQuery = Server.Controllers.Generated.SearchQuery;

namespace Server.Application.Infrastructure;

internal static class ModelsExtensions
{
    public static ProductWithId ToApiProduct(this DbProduct dbProduct) => new(
        id: dbProduct.Id,
        name: dbProduct.Name,
        searchQueries: dbProduct.SearchQueries.Select(x => x.ToApiSearchQuery()).ToList(),
        ruSearchQueries: dbProduct.RuSearchQueries.Select(x => x.ToApiRuSearchQuery()).ToList(),
        isCheckRequired: dbProduct.IsCheckRequired,
        weight: dbProduct.Weight,
        productCalculationResult: dbProduct.ProductCalculationResult.ToApiLotCalculationResult(),
        productRegex:dbProduct.GetProductRegex().ToString(),
        isInteresting: dbProduct.GetIsInteresting()
    );

    public static SearchQuery ToApiSearchQuery(this DbSearchQuery searchQuery) =>
        new(id: searchQuery.Id, query: searchQuery.Query);

    public static RuSearchQuery ToApiRuSearchQuery(this DbRuSearchQuery searchQuery) =>
        new(id: searchQuery.Id, query: searchQuery.Query);

    public static DbSearchQuery ToDbSearchQuery(this SearchQuery searchQuery, Guid productId) => new()
    {
        Id = searchQuery.Id,
        Query = searchQuery.Query,
        ProductId = productId
    };

    public static DbRuSearchQuery ToDbRuSearchQuery(this RuSearchQuery searchQuery, Guid productId) => new()
    {
        Id = searchQuery.Id,
        Query = searchQuery.Query,
        ProductId = productId
    };

    public static DbProduct ToDbProduct(this ProductWithoutId productWithoutId, Guid productId) => new()
    {
        Id = productId,
        Name = productWithoutId.Name,
        Weight = productWithoutId.Weight
    };

    public static LotInfoWithProductId ToApiLot(this Lot lot) => new(
        lotInfo: new(
            condition: lot.Condition,
            conditionDescription: lot.ConditionDescription,
            description: lot.Description,
            locatedIn: lot.LocatedIn,
            lotId: lot.Id,
            categories: lot.Categories.Select(x => new CategoryValue(type: x.Key, value: x.Value)).ToList(),
            name: lot.Name,
            shippingCountry: lot.ShippingCountry,
            pcs: lot.Pcs,
            currency: lot.CurrencyId,
            price: lot.Price,
            purchaseHistory: lot.Purchases.OrderByDescending(x => x.Date).Select(x => x.ToApiPurchaseInfo()).ToList(),
            seller: lot.Seller,
            titleChangeDate: lot.TitleChangeDate.ToString(WellKnown.Formats.TimeFormat),
            shipping: lot.Shipping,
            shippingAdditional: lot.ShippingAdditional,
            shortDescription: lot.ShortDescription,
            lotSize: lot.LotSize
        ),
        productId: lot.ProductId
    );

    public static LotInfoShort ToApiLotInfoShort(this Lot lot) => new(
        condition: lot.Condition,
        conditionDescription: lot.ConditionDescription,
        locatedIn: lot.LocatedIn,
        lotId: lot.Id,
        categories: lot.Categories.Select(x => new CategoryValue(type: x.Key, value: x.Value)).ToList(),
        name: lot.Name,
        shippingCountry: lot.ShippingCountry,
        pcs: lot.Pcs,
        currency: lot.CurrencyId,
        price: lot.Price,
        purchaseHistory: lot.Purchases.OrderByDescending(x => x.Date).Select(x => x.ToApiPurchaseInfo()).ToList(),
        seller: lot.Seller,
        shipping: lot.Shipping,
        titleChangeDate: lot.TitleChangeDate.ToString(WellKnown.Formats.TimeFormat),
        shippingAdditional: lot.ShippingAdditional,
        shortDescription: lot.ShortDescription,
        lotCalculationResult: lot.LotCalculationResult.ToApiLotCalculationResult()
    );

    public static ProductCalculationResult? ToApiLotCalculationResult(this DbProductCalculationResult? productCalculationResult) => productCalculationResult == null ? null : new(
        quantityTotal: productCalculationResult.QuantityTotal, revenue: productCalculationResult.Revenue, revenueAvg: productCalculationResult.RevenueAvg, calculationDate: productCalculationResult.CalculationDate.ToString("dd-MM-yy")
    );

    public static LotCalculationResult? ToApiLotCalculationResult(this DbLotCalculationResult? lotCalculationResult) => lotCalculationResult == null ? null : new(
        quantityTotal: lotCalculationResult.QuantityTotal, revenue: lotCalculationResult.Revenue, revenueAvg: lotCalculationResult.RevenueAvg, calculationDate: lotCalculationResult.CalculationDate.ToString("dd-MM-yy")
    );

    public static PurchaseCalculationResult? ToApiPurchaseCalculationResult(this DbPurchaseCalculationResult? lotCalculationResult) => lotCalculationResult == null ? null : new(
        quantityTotal: lotCalculationResult.QuantityTotal, revenue: lotCalculationResult.Revenue, revenueAvg: lotCalculationResult.RevenueAvg
    );

    public static PurchaseInfo ToApiPurchaseInfo(this Purchase purchase) => new(
        date: purchase.Date.ToString(WellKnown.Formats.TimeFormat),
        price: purchase.Price,
        quantity: purchase.Quantity,
        purchaseCalculationResult: purchase.PurchaseCalculationResult.ToApiPurchaseCalculationResult()
    );

    public static Lot ToDbLot(this LotInfo lotInfo, Guid productId, DateTime updateDate) =>
        new()
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
            TitleChangeDate = DateTime.Parse(lotInfo.TitleChangeDate).ToUniversalTime(),
            UpdateDate = updateDate,
            LotSize = lotInfo.LotSize
        };

    public static Purchase ToDbPurchase(this PurchaseInfo purchaseInfo, long lotId) =>
        new()
        {
            LotId = lotId,
            Date = DateTime.Parse(purchaseInfo.Date).ToUniversalTime(),
            Price = purchaseInfo.Price,
            Quantity = purchaseInfo.Quantity
        };

    public static ClientError ToDbClientError(this ClientErrorInfo error) => new()
    {
        Url = error.Url,
        ErrorText = error.Error
    };

    public static ApiCurrency ToApiCurrency(this DbCurrency currency) => new(
        ebayName: currency.CurrencyEbayName,
        rusName: currency.CurrencyRusName,
        rate: currency.CurrencyRate,
        lastUpdate: currency.LastUpdate.ToString(WellKnown.Formats.TimeFormat)
    );


    public static ICollection<ExtractedFields> ToApiExtractedData(
        this Dictionary<string, Dictionary<string, HashSet<ExtractionResult>>> extractionResult
    )
    {
        return extractionResult.Select(z => new ExtractedFields(
            extractedData: z.Value.OrderByDescending(x => x.Value.Count)
                .Select(
                    x => new LotDataExtractedItem(
                        extractorInfo: x.Value.Select(y => new ExtractorInfo(extractedFrom: y.ExtractedFrom.ToString(), extractor: y.Extractor, match: y.Match))
                            .ToList(),
                        value: x.Key
                    )
                )
                .ToList(),
            fieldName: z.Key
        )).ToList();
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
}