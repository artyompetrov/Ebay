using Server.Application.Abstractions.Queries;
using Server.Domain;

namespace Server.Application.Abstractions.Services;

public interface IProductService
{
    Task<Product> CreateProductAsync(
        string name,
        int weight,
        IReadOnlyList<string> searchQueries,
        IReadOnlyList<string> ruSearchQueries,
        CancellationToken cancellationToken);


    Task UpdateProductAsync(
        Guid productId,
        string name,
        int weight,
        IReadOnlyList<SearchQueryWithId> searchQueries,
        IReadOnlyList<SearchQueryWithId> ruSearchQueries,
        CancellationToken cancellationToken
    );

    Task DeleteProductAsync(
        Guid id,
        CancellationToken cancellationToken);


    Task MarkProductAsCheckedAsync(
        Guid id,
        CancellationToken cancellationToken
    );

    Task<ProductInfo?> GetProductAsync(Guid id, CancellationToken cancellationToken);

    Task<IReadOnlyList<ProductInfo>> GetAllProductsAsync(CancellationToken cancellationToken);
    Task CalculatePricesForProductAsync(Guid productId, CancellationToken cancellationToken);
    Task CalculatePricesForAllAsync(CancellationToken cancellationToken);
}