using Server.Application.Pages;

namespace Server.Application.Abstractions.Measurements;

public interface IProductQueries
{
    Task<ProductInfo?> GetProduct(Guid productId, CancellationToken cancellationToken);
}