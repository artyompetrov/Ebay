using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class IgnoredLotQueries : IIgnoredLotQueries
{
    private readonly ReadDbContext _readDbContext;

    public IgnoredLotQueries(ReadDbContext readDbContext)
    {
        _readDbContext = readDbContext;
    }

    public async Task<IReadOnlyList<long>> GetIgnoredLotIdsAsync(Guid productId, CancellationToken cancellationToken) =>
        await _readDbContext.IgnoredLots
            .Where(x => x.ProductId == productId)
            .Select(x => x.LotId)
            .ToListAsync(cancellationToken);

    public async Task<bool> IsLotIgnoredAsync(Guid productId, long lotId, CancellationToken cancellationToken) =>
        await _readDbContext.IgnoredLots
            .AnyAsync(x => x.ProductId == productId && x.LotId == lotId, cancellationToken);
}
