using Server.Application.Abstractions.Services;

namespace Server.Application.Services;

public class LotsService : ILotsService
{
    public ICollection<LotInfoShort> GetLotsAsync(Guid productId, CancellationToken cancellationToken)
    {
        var exist = await _applicationContext.Products
            .AsNoTracking()
            .AnyAsync(predicate: x => x.Id == productId, cancellationToken: cancellationToken);

        if (!exist)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        var lots = await _applicationContext.Lots
            .AsNoTracking()
            .Include(x => x.Purchases)
            .Where(x => x.ProductId == productId).ToListAsync(cancellationToken);

        return [.. lots.Select(x => x.ToApiLotInfoShort())];
    }

    public async Task UpsertLotInfoAsync(LotInfo lotInfo, Guid productId, CancellationToken cancellationToken)
    {
        
        var validationErrors = new List<(string key, string[] value)>();
        if (lotInfo.ShippingAdditional == null)
        {
            validationErrors.Add((key: nameof(lotInfo.ShippingAdditional), value: ["Not set"]));
        }

        if (lotInfo.Shipping == null)
        {
            validationErrors.Add((key: nameof(lotInfo.Shipping), value: ["Not set"]));
        }

        if (!new HashSet<string> { WellKnown.Categories.Conditions.CategoryName, WellKnown.Categories.TestState.CategoryName }.SequenceEqual(
                lotInfo.Categories.Select(x => x.Type)
            ))
        {
            validationErrors.Add((key: nameof(lotInfo.Categories), value: ["Not all categories set"]));
        }

        if (validationErrors.Count > 0)
        {
            throw NonOkHttpAnswerException.ValidationError400(validationErrors);
        }

        var dbLotInfo = lotInfo.ToDbLot(productId: productId, updateDate: DateTime.UtcNow);

        using var transaction = TransactionScopeFactory.Create();

        _ = await _applicationContext.Lots.Upsert(dbLotInfo).RunAsync(cancellationToken);

        var titleChangedDate = DateTime.Parse(lotInfo.TitleChangeDate, CultureInfo.InvariantCulture).ToUniversalTime();

        var filteredPurchaseHistory = lotInfo.PurchaseHistory
            .Select(x => x.ToDbPurchase(lotId: lotInfo.LotId))
            .Where(purchase => purchase.Date >= titleChangedDate)
            .ToList();

        _ = await _applicationContext.Purchases.UpsertRange(filteredPurchaseHistory).RunAsync(cancellationToken);

        _applicationContext.RemoveRange(
            _applicationContext.Purchases.Where(x => x.LotId == lotInfo.LotId && x.Date < titleChangedDate)
        );

        _applicationContext.RemoveRange(
            _applicationContext.IgnoredLots.Where(x => x.ProductId == productId && x.LotId == lotInfo.LotId)
        );

        await _publishEndpoint.Publish(new CalculatePricesForLot(lotInfo.LotId), cancellationToken);
        _ = await _applicationContext.SaveChangesAsync(cancellationToken);
        transaction.Complete();
        
    }

    public async Task<ICollection<long>> GetIgnoredLotsAsync(Guid productId, CancellationToken cancellationToken)
    {
        var ignoredLots = await _applicationContext.IgnoredLots
            .AsNoTracking()
            .Where(x => x.ProductId == productId)
            .Select(x => x.LotId)
            .ToListAsync(cancellationToken);

        return ignoredLots;
    }

    public async Task IgnoreLotsAsync(IEnumerable<long> ignoredLots, Guid productId, CancellationToken cancellationToken)
    {
                
        using var transaction = TransactionScopeFactory.Create();

        var lotIds = ignoredLots.ToList();

        var alreadySaved = await _applicationContext.Lots
            .AnyAsync(predicate: x => x.ProductId == productId && lotIds.Contains(x.Id), cancellationToken: cancellationToken);

        if (!alreadySaved)
        {
            _ = await _applicationContext.IgnoredLots
                .UpsertRange(lotIds.Select(x => new IgnoredLot { ProductId = productId, LotId = x }))
                .RunAsync(cancellationToken);
        }

        transaction.Complete();
    }

    public async Task<LotInfoWithProductId?> GetLotInfoAsync(long lotId, CancellationToken cancellationToken)
    {
        
        var dbLot = await _applicationContext.Lots
            .AsNoTracking()
            .Include(x => x.Purchases)
            .SingleOrDefaultAsync(
                predicate: x => x.Id == lotId,
                cancellationToken: cancellationToken
            );
    }

    public async Task<bool> GetIsLotIgnoredForProductAsync(Guid productId, long lotId, CancellationToken cancellationToken)
    {
        
        await _applicationContext.IgnoredLots.AnyAsync(x => x.LotId == lotId && x.ProductId == productId, cancellationToken: cancellationToken);
      
    }

    public async Task<ICollection<long>> GetLotIdsAsync(CancellationToken cancellationToken)
    {
        var result = await _applicationContext.Lots
            .AsNoTracking()
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        return result;
    }

    public async Task DeleteLotInfoAsync(long lotId, CancellationToken cancellationToken)
    {
        using var transaction = TransactionScopeFactory.Create();

        var lot = await _applicationContext.Lots
                      .SingleOrDefaultAsync(predicate: x => x.Id == lotId, cancellationToken: cancellationToken) ??
                  throw new InvalidOperationException($"Lot with id {lotId} not found");

        await _publishEndpoint.Publish(new CalculatePricesForProduct(lot.ProductId), cancellationToken);

        _ = _applicationContext.Lots.Remove(lot);
        _ = await _applicationContext.SaveChangesAsync(cancellationToken);

        transaction.Complete();
    }

    public async Task<ICollection<LotState>> GetLotStatesAsync(IEnumerable<long> lotIds, CancellationToken cancellationToken)
    {
        var idsToSelect = lotIds.ToHashSet();
        var result = await _applicationContext.Lots
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
}