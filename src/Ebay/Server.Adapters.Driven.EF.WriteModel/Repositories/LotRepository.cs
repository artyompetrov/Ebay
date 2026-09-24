using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class LotRepository : ILotRepository
{
    private readonly WriteModelDbContext _dbContext;

    public LotRepository(WriteModelDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Lot?> GetByIdAsync(long id, CancellationToken cancellationToken) => await _dbContext.Lots
        .Include(x => x.Purchases)
        .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddAsync(Lot aggregate, CancellationToken cancellationToken) => _ = await _dbContext.Lots.AddAsync(aggregate, cancellationToken);

    public async Task RemoveAsync(long id, CancellationToken cancellationToken)
    {
        await _dbContext.Lots.Where(o => o.Id == id)
            .ExecuteDeleteAsync(cancellationToken: cancellationToken);
    }

    public async Task RemoveAsync(IReadOnlySet<long> ids, CancellationToken cancellationToken)
    {
        if (ids.Count == 0)
        {
            return;
        }

        const int batchSize = 1000; // безопасный размер IN (...)
        foreach (var batch in ids.Chunk(batchSize))
        {
            await _dbContext.Lots
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}
