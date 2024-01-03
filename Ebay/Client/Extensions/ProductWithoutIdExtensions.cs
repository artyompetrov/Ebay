namespace Ebay.Client.Extensions;

public static class ProductWithoutIdExtensions
{
    public static Product ToProduct(this ProductWithoutId productWithoutId, Guid id) => new()
        { Id = id, Name = productWithoutId.Name, SearchQuery = productWithoutId.SearchQuery };

    public static ProductWithoutId ToProductWithoutId(this Product productWithoutId) => new()
        { Name = productWithoutId.Name, SearchQuery = productWithoutId.SearchQuery };

    public static Product Copy(this Product product) => new()
        { Id = product.Id, Name = product.Name, SearchQuery = product.SearchQuery };
}