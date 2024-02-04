using Ebay.Server.Controllers.Generated;
using Ebay.Server.Data.Models;
using DbProduct = Ebay.Server.Data.Models.Product;
using DbSearchQuery = Ebay.Server.Data.Models.SearchQuery;
using DbCurrency = Ebay.Server.Data.Models.Currency;
using ApiCurrency = Ebay.Server.Controllers.Generated.Currency;
using SearchQuery = Ebay.Server.Controllers.Generated.SearchQuery;

namespace Ebay.Server.Infrastructure;

public static class ModelsExtensions
{
    public static ProductWithId ToApiProduct(this DbProduct dbProduct) => new(
        id: dbProduct.Id,
        name: dbProduct.Name,
        searchQueries: dbProduct.SearchQueries.Select(x => x.ToApiSearchQuery()).ToList(),
        lastCheckTime: dbProduct.LastCheckTime.ToString(WellKnown.Formats.TimeFormat));

    public static SearchQuery ToApiSearchQuery(this DbSearchQuery searchQuery) =>
        new(id: searchQuery.Id, query: searchQuery.Query);

    public static DbSearchQuery ToDbSearchQuery(this SearchQuery searchQuery, Guid productId) => new()
    {
        Id = searchQuery.Id,
        Query = searchQuery.Query,
        ProductId = productId
    };

    public static DbProduct ToDbProduct(this ProductWithoutId productWithoutId, Guid productId) => new()
    {
        Id = productId,
        Name = productWithoutId.Name
    };

    public static LotInfoWithProductId ToApiLot(this Lot lot) => new(
        lotInfo: new(
            condition: lot.Condition,
            conditionDescription: lot.ConditionDescription,
            description: lot.Description,
            ignoreThatLot: lot.IgnoreThatLot,
            locatedIn: lot.LocatedIn,
            lotId: lot.Id,
            manualConditionId: lot.ManualCondition,
            name: lot.Name,
            shippingCountry: lot.ShippingCountry,
            pcs: lot.Pcs,
            currency: lot.Currency,
            price: lot.Price,
            purchaseHistory: lot.Purchases.OrderByDescending(x => x.Date).Select(x => x.ToApiPurchaseInfo()).ToList(),
            seller: lot.Seller,
            shipping: lot.Shipping,
            shippingAdditional: lot.ShippingAdditional),
        productId: lot.ProductId);

    public static PurchaseInfo ToApiPurchaseInfo(this Purchase purchase) => new(
        date: purchase.Date.ToString(WellKnown.Formats.TimeFormat),
        price: purchase.Price,
        quantity: purchase.Quantity);

    public static Lot ToDbLot(this LotInfo lotInfo, Guid productId, DateTime updateDate) =>
        new()
        {
            ProductId = productId,
            Id = lotInfo.LotId,
            Name = lotInfo.Name,
            Pcs = lotInfo.Pcs,
            Currency = lotInfo.Currency,
            ShippingCountry = lotInfo.ShippingCountry,
            Price = lotInfo.Price,
            Shipping = lotInfo.Shipping!.Value,
            ShippingAdditional = lotInfo.ShippingAdditional!.Value,
            Description = lotInfo.Description,
            Condition = lotInfo.Condition,
            ConditionDescription = lotInfo.ConditionDescription,
            Seller = lotInfo.Seller,
            LocatedIn = lotInfo.LocatedIn,
            ManualCondition = lotInfo.ManualConditionId,
            IgnoreThatLot = lotInfo.IgnoreThatLot,
            UpdateDate = updateDate
        };

    public static Purchase ToDbPurchase(this PurchaseInfo purchaseInfo, long lotId) =>
        new()
        {
            LotId = lotId,
            Date = DateTime.Parse(purchaseInfo.Date).ToUniversalTime(),
            Price = purchaseInfo.Price,
            Quantity = purchaseInfo.Quantity
        };

    public static ClientError ToDbClientError(this ClientErrorInfo error) => new ClientError
    {
        Url = error.Url,
        ErrorText = error.Error
    };

    public static ApiCurrency ToApiCurrency(this DbCurrency currency) => new(
        ebayName: currency.CurrencyEbayName,
        rusName: currency.CurrencyRusName,
        rate: currency.CurrencyRate);
}