using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class IgnoredLotRepository : IIgnoredLotRepository
{
    private readonly WriteModelDbContext _dbContext;

    public IgnoredLotRepository(WriteModelDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    private const int InsertMissingMaxAttempts = 3;

    public async Task InsertMissingAsync(Guid productId, IReadOnlySet<long> lotIds, CancellationToken cancellationToken)
    {
        if (lotIds.Count == 0)
        {
            return;
        }

        for (var attempt = 1; attempt <= InsertMissingMaxAttempts; attempt++)
        {
            var existingLotIds = await _dbContext.IgnoredLots
                .Where(x => x.ProductId == productId && lotIds.Contains(x.LotId))
                .Select(x => x.LotId)
                .ToListAsync(cancellationToken);

            var existingLotIdSet = existingLotIds.ToHashSet();
            var missing = lotIds.Where(x => !existingLotIdSet.Contains(x)).ToList();

            if (missing.Count == 0)
            {
                return;
            }

            var entries = missing.Select(lotId => IgnoredLot.Create(productId, lotId)).ToList();
            await _dbContext.IgnoredLots.AddRangeAsync(entries, cancellationToken);

            try
            {
                await _dbContext.SaveChangesAsync(cancellationToken);
                return;
            }
            catch (DbUpdateException) when (attempt < InsertMissingMaxAttempts)
            {
                // A concurrent request can insert one of the same (ProductId, LotId) pairs between the
                // existence check above and this save (the composite primary key rejects the duplicate).
                // Detach this attempt's entries and retry against a fresh existence check - the previous
                // UpsertRange-based implementation tolerated exactly this race.
                foreach (var entry in entries)
                {
                    _dbContext.Entry(entry).State = EntityState.Detached;
                }
            }
        }
    }

    public async Task RemoveAsync(Guid productId, long lotId, CancellationToken cancellationToken)
    {
        await _dbContext.IgnoredLots
            .Where(x => x.ProductId == productId && x.LotId == lotId)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
