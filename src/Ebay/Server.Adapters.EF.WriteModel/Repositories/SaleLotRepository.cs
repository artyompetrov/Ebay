using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Repositories;
using Server.Application.Data;
using Server.Domain;

namespace Server.Adapters.EF.WriteModel.Repositories;

internal sealed class SaleLotRepository : ISaleLotRepository
{
    private readonly ApplicationDbContext _dbContext;

    public SaleLotRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<SaleLot?> GetByIdAsync(string id, CancellationToken cancellationToken) => await _dbContext.SaleLots.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task SaveAsync(SaleLot aggregate, CancellationToken cancellationToken) => _ = await _dbContext.SaleLots.AddAsync(aggregate, cancellationToken);

    public async Task RemoveAsync(string id, CancellationToken cancellationToken)
    {
        _ = await _dbContext.SaleLots.Where(x => x.Id == id)
            .ExecuteDeleteAsync(cancellationToken: cancellationToken);
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
            _ = await _dbContext.SaleLots
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}
