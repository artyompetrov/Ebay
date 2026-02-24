using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class LotForSaleQueries : ILotForSaleQueries
{
    private readonly ReadDbContext _dbContext;

    public LotForSaleQueries(ReadDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<LotForSaleInfo>> GetLotForSalesAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.LotForSales
            .OrderBy(x => x.Id)
            .Select(x => new LotForSaleInfo(x.Id, x.Name, x.ProductId, x.ProductState))
            .ToListAsync(cancellationToken);
    }
}