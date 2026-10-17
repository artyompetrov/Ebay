using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class LotForSaleQueries : ILotForSaleQueries
{
    private readonly IDbContextFactory<ReadDbContext> _dbContextFactory;

    public LotForSaleQueries(IDbContextFactory<ReadDbContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }

    public async Task<IReadOnlyCollection<LotForSaleInfo>> GetLotForSalesAsync(CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        return await dbContext.LotForSales
            .OrderBy(x => x.Id)
            .Select(x => new LotForSaleInfo(x.Id, x.Name, x.ProductId, x.ProductState, x.MeasurementState))
            .ToListAsync(cancellationToken);
    }

    public async Task<LotForSaleInfo?> GetLotForSaleByIdAsync(string lotId, CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        return await dbContext.LotForSales
            .Where(x => x.Id == lotId)
            .Select(x => new LotForSaleInfo(x.Id, x.Name, x.ProductId, x.ProductState, x.MeasurementState))
            .FirstOrDefaultAsync(cancellationToken);
    }
}