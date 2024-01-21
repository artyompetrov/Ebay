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
            UpdateDate = updateDate
        };

    public static Purchase ToDbPurchase(this PurchaseInfo purchaseInfo, long lotId) =>
        new()
        {
            LotId = lotId,
            Date = DateTime.Parse(purchaseInfo.Date),
            Price = purchaseInfo.Price,
            Quantity = purchaseInfo.Quantity
        };
}