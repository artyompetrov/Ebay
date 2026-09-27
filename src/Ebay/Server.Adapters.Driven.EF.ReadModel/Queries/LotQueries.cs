using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class LotQueries : ILotQueries
{
    private readonly ReadDbContext _readDbContext;

    public LotQueries(ReadDbContext readDbContext)
    {
        _readDbContext = readDbContext;
    }

    public async Task<IReadOnlyList<LotDetails>> GetLotsForProductAsync(Guid productId, CancellationToken cancellationToken)
    {
        var lots = await _readDbContext.Lots
            .AsSplitQuery()
            .Include(x => x.Purchases)
            .Where(x => x.ProductId == productId)
            .ToListAsync(cancellationToken);

        return [.. lots.Select(Map)];
    }

    public async Task<LotDetails?> GetLotAsync(long lotId, CancellationToken cancellationToken)
    {
        var lot = await _readDbContext.Lots
            .AsSplitQuery()
            .Include(x => x.Purchases)
            .SingleOrDefaultAsync(x => x.Id == lotId, cancellationToken);

        return lot == null ? null : Map(lot);
    }

    public async Task<IReadOnlyList<long>> GetAllLotIdsAsync(CancellationToken cancellationToken) =>
        await _readDbContext.Lots.Select(x => x.Id).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<long>> GetLotIdsForProductAsync(Guid productId, CancellationToken cancellationToken) =>
        await _readDbContext.Lots.Where(x => x.ProductId == productId).Select(x => x.Id).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<LotUpdateInfo>> GetLotUpdateInfoAsync(IReadOnlySet<long> lotIds, CancellationToken cancellationToken)
    {
        var result = await _readDbContext.Lots
            .Where(x => lotIds.Contains(x.Id))
            .Select(x => new { x.Id, x.UpdateDate })
            .ToListAsync(cancellationToken);

        return [.. result.Select(x => new LotUpdateInfo(x.Id, x.UpdateDate))];
    }

    public async Task<bool> AnyLotExistsForProductAsync(Guid productId, IReadOnlySet<long> lotIds, CancellationToken cancellationToken) =>
        await _readDbContext.Lots.AnyAsync(x => x.ProductId == productId && lotIds.Contains(x.Id), cancellationToken);

    private static LotDetails Map(ReadModelSchema.LotView lot) => new(
        Id: lot.Id,
        ProductId: lot.ProductId,
        Name: lot.Name,
        Pcs: lot.Pcs,
        LotSize: lot.LotSize,
        CurrencyId: lot.CurrencyId,
        ShippingCountry: lot.ShippingCountry,
        Price: lot.Price,
        Shipping: lot.Shipping,
        ShippingAdditional: lot.ShippingAdditional,
        Description: lot.Description,
        ShortDescription: lot.ShortDescription,
        Condition: lot.Condition,
        ConditionDescription: lot.ConditionDescription,
        Seller: lot.Seller,
        LocatedIn: lot.LocatedIn,
        TitleChangeDate: lot.TitleChangeDate,
        UpdateDate: lot.UpdateDate,
        Categories: lot.Categories,
        Purchases: [.. lot.Purchases
            .OrderByDescending(x => x.Date)
            .Select(x => new PurchaseDetails(x.Date, x.LotId, x.Price, x.Quantity, x.PurchaseCalculationResult))],
        CalculationResult: lot.LotCalculationResult);
}
