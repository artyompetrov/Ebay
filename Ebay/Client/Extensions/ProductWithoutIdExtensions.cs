namespace Ebay.Client.Extensions;

public static class ProductWithoutIdExtensions
{
    //todo возможно не надо
    public static Product ToProduct(this ProductWithoutId productWithoutId, Guid id) => new()
        { Id = id, Name = productWithoutId.Name, SearchQuery = productWithoutId.SearchQuery };
}