using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain.Measurements;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class MatchedPairDifferenceRepository : IMatchedPairDifferenceRepository
{
    public async Task<MatchedPairDifference?> GetByIdAsync(
        IWriteModelUnitOfWork unitOfWork,
        MatchedPairDifferenceId id,
        CancellationToken cancellationToken) => await WriteModelUnitOfWork.From(unitOfWork).DbContext.MatchedPairDifferences.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddAsync(IWriteModelUnitOfWork unitOfWork, MatchedPairDifference aggregate, CancellationToken cancellationToken) => _ = await WriteModelUnitOfWork.From(unitOfWork).DbContext.MatchedPairDifferences.AddAsync(aggregate, cancellationToken);

    public async Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, MatchedPairDifferenceId id, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        await dbContext.MatchedPairDifferences.Where(o => o.Id == id)
            .ExecuteDeleteAsync(cancellationToken: cancellationToken);
    }

    public async Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<MatchedPairDifferenceId> ids, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        if (ids.Count == 0)
        {
            return;
        }

        const int batchSize = 1000; // безопасный размер IN (...)
        foreach (var batch in ids.Chunk(batchSize))
        {
            await dbContext.MatchedPairDifferences
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }

    public async Task RemoveByMeasurementIds(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<string> measurementIds, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        if (measurementIds.Count == 0)
        {
            return;
        }

        const int batchSize = 1000; // безопасный размер IN (...)
        foreach (var batch in measurementIds.Chunk(batchSize))
        {
            await dbContext.MatchedPairDifferences
                .Where(x => batch.Contains(x.Measurement1Id) || batch.Contains(x.Measurement2Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}