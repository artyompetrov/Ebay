using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain.LotForSale;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class LotForSaleRepository : ILotForSaleRepository
{
    private readonly WriteModelDbContext _dbContext;

    public LotForSaleRepository(WriteModelDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<LotForSale?> GetByIdAsync(string id, CancellationToken cancellationToken)
    {
        return await _dbContext.LotForSales
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task AddAsync(LotForSale aggregate, CancellationToken cancellationToken)
    {
        await _dbContext.LotForSales.AddAsync(aggregate, cancellationToken);
    }

    public async Task RemoveAsync(string id, CancellationToken cancellationToken)
    {
        await _dbContext.LotForSales
            .Where(x => x.Id == id)
            .ExecuteDeleteAsync(cancellationToken);
    }

    public async Task RemoveAsync(IReadOnlySet<string> ids, CancellationToken cancellationToken)
    {
        if (ids.Count == 0)
        {
            return;
        }

        const int batchSize = 1000;
        foreach (var batch in ids.Chunk(batchSize))
        {
            await _dbContext.LotForSales
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}
