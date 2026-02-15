using Server.Application.New.Models;

namespace Server.Application.New.Abstractions.Queries;

/// <summary>
/// контракт.
/// </summary>
public interface IProductQueries
{
    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task<ProductInfo?> GetProductAsync(Guid productId, CancellationToken cancellationToken);

    //todo сделать асинхронную энумерацию или пагинацию
    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task<IReadOnlyList<ProductInfo>> GetAllProductsAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task<IReadOnlyList<Guid>> GetAllProductsIdsAsync(CancellationToken cancellationToken);
}
