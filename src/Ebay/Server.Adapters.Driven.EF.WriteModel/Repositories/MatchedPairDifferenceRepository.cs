using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Abstractions.Repositories;
using Server.Application.Data;
using Server.Domain.Measurements;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class MatchedPairDifferenceRepository : IMatchedPairDifferenceRepository
{
    private readonly ApplicationDbContext _dbContext;

    public MatchedPairDifferenceRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<MatchedPairDifference?> GetByIdAsync(
        MatchedPairDifferenceId id,
        CancellationToken cancellationToken) => await _dbContext.MatchedPairDifferences.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddAsync(MatchedPairDifference aggregate, CancellationToken cancellationToken) => _ = await _dbContext.MatchedPairDifferences.AddAsync(aggregate, cancellationToken);

    public async Task RemoveAsync(MatchedPairDifferenceId id, CancellationToken cancellationToken)
    {
        _ = await _dbContext.MatchedPairDifferences.Where(o => o.Id == id)
            .ExecuteDeleteAsync(cancellationToken: cancellationToken);
    }

    public async Task RemoveAsync(IReadOnlySet<MatchedPairDifferenceId> ids, CancellationToken cancellationToken)
    {
        if (ids.Count == 0)
        {
            return;
        }

        const int batchSize = 1000; // безопасный размер IN (...)
        foreach (var batch in ids.Chunk(batchSize))
        {
            _ = await _dbContext.MatchedPairDifferences
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }

    public async Task RemoveByMeasurementIds(IReadOnlySet<string> measurementIds, CancellationToken cancellationToken)
    {
        if (measurementIds.Count == 0)
        {
            return;
        }

        const int batchSize = 1000; // безопасный размер IN (...)
        foreach (var batch in measurementIds.Chunk(batchSize))
        {
            _ = await _dbContext.MatchedPairDifferences
                .Where(x => batch.Contains(x.Measurement1Id) || batch.Contains(x.Measurement2Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}
