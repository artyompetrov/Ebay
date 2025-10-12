using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Measurements;

namespace Sever.Adapters.EF.ReadModel;

internal sealed class ProductQueries : IProductQueries
{
    private readonly ReadDbContext _readDbContext;

    public ProductQueries(ReadDbContext readDbContext)
    {
        _readDbContext = readDbContext;
    }

    public async Task<ProductInfo?> GetProduct(Guid productId, CancellationToken cancellationToken)
    {
        var result = await _readDbContext
            .Products
            .Include(x => x.SearchQueries)
            .SingleOrDefaultAsync(x => x.Id == productId, cancellationToken: cancellationToken);

        if (result == null)
            return null;

        return new ProductInfo(result.SearchQueries.Select(x => x.Query).ToList());
    }
}