using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions;
using Server.Application.Abstractions.Repositories;
using Server.Application.Data;
using Server.Domain.Measurements;

namespace Server.Adapters.EF.WriteModel;

internal class MatchedPairDifferenceRepository : IMatchedPairDifferenceRepository
{
    private readonly ApplicationDbContext _dbContext;

    public MatchedPairDifferenceRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<MatchedPairDifference?> GetByIdAsync(
        MatchedPairDifferenceId id,
        CancellationToken cancellationToken)
    {
        return await _dbContext.MatchedPairDifferences.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task SaveAsync(MatchedPairDifference aggregate, CancellationToken cancellationToken)
    {
        await _dbContext.MatchedPairDifferences.AddAsync(aggregate, cancellationToken);
    }

    public async Task RemoveAsync(MatchedPairDifferenceId id, CancellationToken cancellationToken)
    {
        await _dbContext.MatchedPairDifferences.Where(o => o.Id == id)
            .ExecuteDeleteAsync(cancellationToken: cancellationToken);
    }

    public async Task RemoveAsync(IReadOnlySet<MatchedPairDifferenceId> ids, CancellationToken cancellationToken)
    {
        if (ids.Count == 0)
            return;

        const int batchSize = 1000; // безопасный размер IN (...)
        foreach (var batch in ids.Chunk(batchSize))
        {
            await _dbContext.MatchedPairDifferences
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }

    public async Task RemoveByMeasurementId(string measurementId, CancellationToken cancellationToken)
    {
        await _dbContext.MatchedPairDifferences
            .Where(x => x.Measurement1Id == measurementId || x.Measurement2Id == measurementId)
            .ExecuteDeleteAsync(cancellationToken);
    }
}