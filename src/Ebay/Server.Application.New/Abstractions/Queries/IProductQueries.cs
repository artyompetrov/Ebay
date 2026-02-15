using Server.Application.New.Models;

namespace Server.Application.New.Abstractions.Queries;

public interface IProductQueries
{
    Task<ProductInfo?> GetProductAsync(Guid productId, CancellationToken cancellationToken);

    //todo сделать асинхронную энумерацию или пагинацию
    Task<IReadOnlyList<ProductInfo>> GetAllProductsAsync(CancellationToken cancellationToken);

    Task<IReadOnlyList<Guid>> GetAllProductsIdsAsync(CancellationToken cancellationToken);
}