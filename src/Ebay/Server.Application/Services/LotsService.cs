using System.Globalization;
using Server.Application.Abstractions;
using Server.Application.Abstractions.Services;
using Server.Application.Consumers.PriceCalculator;
using Server.Application.Infrastructure;
using Server.Domain;

namespace Server.Application.Services;

internal class LotsService : ILotsService
{
    private readonly IUnitOfWork _unitOfWork;

    public LotsService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task UpsertLotInfoAsync(Lot lot, CancellationToken cancellationToken)
    {
        await using var tr = await _unitOfWork.BeginTransactionAsync(cancellationToken);
        

        var dbLotInfo = lotInfo.ToDbLot(productId: productId, updateDate: DateTime.UtcNow);
        

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
        
        _ = await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        await tr.CommitAsync(cancellationToken);
        
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
}