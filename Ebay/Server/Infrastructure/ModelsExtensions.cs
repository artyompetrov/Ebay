using Ebay.Server.Controllers.Generated;
using Ebay.Server.Data.Models;
using DbProduct = Ebay.Server.Data.Models.Product;

namespace Ebay.Server.Infrastructure;

public static class ModelsExtensions
{
    public static ProductWithId ToApiProduct(this DbProduct dbProduct) => new(
        id: dbProduct.Id,
        name: dbProduct.Name,
        searchQuery: dbProduct.SearchQuery);

    public static DbProduct ToDbProduct(this ProductWithoutId productWithoutId, Guid id) => new()
        { Id = id, Name = productWithoutId.Name, SearchQuery = productWithoutId.SearchQuery };

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
            pcs: lot.Pcs,
            price: lot.Price,
            purchaseHistory: lot.Purchases.Select(x => x.ToApiPurchaseInfo()).ToList(),
            seller: lot.Seller,
            shipping: lot.Shipping,
            shippingAdditional: lot.ShippingAdditional),
        productId: lot.ProductId);

    public static PurchaseInfo ToApiPurchaseInfo(this Purchase purchase) => new(
        date: purchase.Date.ToString("O"),
        price: purchase.Price,
        quantity: purchase.Quantity);

    public static Lot ToDbLot(this LotInfo lotInfo, Guid productId, DateTime updateDate) =>
        new()
        {
            ProductId = productId,
            Id = lotInfo.LotId,
            Name = lotInfo.Name,
            Pcs = lotInfo.Pcs,
            Price = lotInfo.Price,
            Shipping = lotInfo.Shipping,
            ShippingAdditional = lotInfo.ShippingAdditional,
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
}