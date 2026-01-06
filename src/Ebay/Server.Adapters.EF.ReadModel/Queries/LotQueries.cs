using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Queries;

namespace Server.Adapters.EF.ReadModel.Queries;

internal class LotQueries : ILotQueries
{
    private readonly ReadDbContext _context;

    public LotQueries(ReadDbContext context)
    {
        _context = context;
    }
    
    public async ICollection<LotInfoShort>? GetLotsAsync(Guid productId, CancellationToken cancellationToken)
    {
        var exist = await _context.Products
            .AnyAsync(predicate: x => x.Id == productId, cancellationToken: cancellationToken);

        if (!exist)
        {
            return null;
        }

        var lots = await _context.Lots
            .AsNoTracking()
            .Include(x => x.Purchases)
            .Where(x => x.ProductId == productId).ToListAsync(cancellationToken);

        return [.. lots.Select(x => x.ToApiLotInfoShort())];
        
    }

    public async Task<ICollection<LotState>> GetLotStatesAsync(IEnumerable<long> lotIds, CancellationToken cancellationToken)
    {
        
        var idsToSelect = lotIds.ToHashSet();
        var result = await _context.Lots
            .AsNoTracking()
            .Where(x => idsToSelect.Contains(x.Id))
            .Select(x => new { x.Id, x.UpdateDate })
            .ToListAsync(cancellationToken);

        return
        [
            .. result.Select(x => new LotState(
                    lastUpdate: x.UpdateDate.ToString(WellKnown.Formats.TimeFormat, CultureInfo.InvariantCulture),
                    lotId: x.Id
                )
            )
        ];
        
    }

    public async Task<ICollection<long>> GetIgnoredLotsAsync(Guid productId, CancellationToken cancellationToken)
    {
        
        var ignoredLots = await _context.IgnoredLots
            .AsNoTracking()
            .Where(x => x.ProductId == productId)
            .Select(x => x.LotId)
            .ToListAsync(cancellationToken);

        return ignoredLots;
    }

    public async Task<LotInfoWithProductId?> GetLotInfoAsync(long lotId, CancellationToken cancellationToken)
    {
        var dbLot = await _context.Lots
            .AsNoTracking()
            .Include(x => x.Purchases)
            .SingleOrDefaultAsync(
                predicate: x => x.Id == lotId,
                cancellationToken: cancellationToken
            );
        
    }

    public async Task<ICollection<long>> GetLotIdsAsync(CancellationToken cancellationToken)
    {
        var result = await _applicationContext.Lots
            .AsNoTracking()
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        return result;
    }

    
    public async Task<bool> GetIsLotIgnoredForProductAsync(Guid productId, long lotId, CancellationToken cancellationToken)
    {
       return  await _context.IgnoredLots.AnyAsync(x => x.LotId == lotId && x.ProductId == productId, cancellationToken: cancellationToken);
    }

    public async Task<ICollection<long>> GetLotIdsAsync(CancellationToken cancellationToken)
    {
        var result = await _context.Lots
            .AsNoTracking()
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        return result;
    }
}