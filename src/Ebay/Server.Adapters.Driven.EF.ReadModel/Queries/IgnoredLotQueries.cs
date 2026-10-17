using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class IgnoredLotQueries : IIgnoredLotQueries
{
    private readonly IDbContextFactory<ReadDbContext> _dbContextFactory;

    public IgnoredLotQueries(IDbContextFactory<ReadDbContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }

    public async Task<IReadOnlyList<long>> GetIgnoredLotIdsAsync(Guid productId, CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        return await dbContext.IgnoredLots
            .Where(x => x.ProductId == productId)
            .Select(x => x.LotId)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> IsLotIgnoredAsync(Guid productId, long lotId, CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        return await dbContext.IgnoredLots
            .AnyAsync(x => x.ProductId == productId && x.LotId == lotId, cancellationToken);
    }
}
