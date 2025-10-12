using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Repositories;
using Server.Application.Data;
using Server.Domain.Measurements;

namespace Server.Adapters.EF.WriteModel;

internal class TubeWorkingPointsRepository : ITubeWorkingPointsRepository
{
    private readonly ApplicationDbContext _dbContext;

    public TubeWorkingPointsRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<TubeWorkingPoint?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.TubeWorkingPoints.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task SaveAsync(TubeWorkingPoint aggregate, CancellationToken cancellationToken)
    {
        await _dbContext.TubeWorkingPoints.AddAsync(aggregate, cancellationToken);
    }

    public async Task RemoveAsync(Guid id, CancellationToken cancellationToken)
    {
        await _dbContext.TubeWorkingPoints.Where(o => o.Id == id)
            .ExecuteDeleteAsync(cancellationToken: cancellationToken);
    }

    public async Task RemoveAsync(IReadOnlySet<Guid> ids, CancellationToken cancellationToken)
    {
        if (ids.Count == 0)
            return;

        const int batchSize = 1000; // безопасный размер IN (...)
        foreach (var batch in ids.Chunk(batchSize))
        {
            await _dbContext.TubeWorkingPoints
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}