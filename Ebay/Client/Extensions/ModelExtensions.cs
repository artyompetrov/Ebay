namespace Ebay.Client.Extensions;

public static class ModelExtensions
{
    public static ProductWithoutId Copy(this ProductWithoutId product) => new()
        { Name = product.Name, SearchQuery = product.SearchQuery };

    public static ProductWithId Copy(this ProductWithId product) => new()
        { Id = product.Id, Name = product.Name, SearchQuery = product.SearchQuery };

    public static ProductWithoutId ToProductWithoutId(this ProductWithId productWithId) => new()
    {
        Name = productWithId.Name,
        SearchQuery = productWithId.SearchQuery
    };
}