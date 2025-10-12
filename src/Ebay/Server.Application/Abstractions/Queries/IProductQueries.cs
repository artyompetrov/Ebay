namespace Server.Application.Abstractions.Queries;

public interface IProductQueries
{
    Task<ProductInfo?> GetProduct(Guid productId, CancellationToken cancellationToken);
}