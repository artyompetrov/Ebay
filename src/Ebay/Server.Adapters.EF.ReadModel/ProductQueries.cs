using Server.Application.Abstractions.Measurements;

namespace Sever.Adapters.EF.ReadModel;

public class ProductQueries : IProductQueries
{
    public async Task<ProductInfo?> GetProduct(Guid productId, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}