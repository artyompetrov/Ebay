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

    public async Task InsertMissingAsync(Guid productId, IReadOnlySet<long> lotIds, CancellationToken cancellationToken)
    {
        if (lotIds.Count == 0)
        {
            return;
        }

        var existingLotIds = await _dbContext.IgnoredLots
            .Where(x => x.ProductId == productId && lotIds.Contains(x.LotId))
            .Select(x => x.LotId)
            .ToListAsync(cancellationToken);

        var existingLotIdSet = existingLotIds.ToHashSet();
        var missing = lotIds.Where(x => !existingLotIdSet.Contains(x));

        await _dbContext.IgnoredLots.AddRangeAsync(
            missing.Select(lotId => IgnoredLot.Create(productId, lotId)),
            cancellationToken);
    }

    public async Task RemoveAsync(Guid productId, long lotId, CancellationToken cancellationToken)
    {
        await _dbContext.IgnoredLots
            .Where(x => x.ProductId == productId && x.LotId == lotId)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
