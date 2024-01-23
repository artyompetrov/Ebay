using System.Globalization;
using System.Transactions;
using Ebay.Client.Clients.Generated;
using Ebay.Server.Controllers.Generated;
using Ebay.Server.Data;
using Ebay.Server.Data.Models;
using Ebay.Server.Infrastructure;
using Microsoft.EntityFrameworkCore;
using DbProduct = Ebay.Server.Data.Models.Product;
using LotInfo = Ebay.Server.Controllers.Generated.LotInfo;
using LotInfoWithProductId = Ebay.Server.Controllers.Generated.LotInfoWithProductId;
using LotState = Ebay.Server.Controllers.Generated.LotState;
using ManualCondition = Ebay.Server.Controllers.Generated.ManualCondition;
using NotFoundProblemDetailedInfo = Ebay.Server.Controllers.Generated.NotFoundProblemDetailedInfo;
using ProductWithId = Ebay.Server.Controllers.Generated.ProductWithId;
using ProductWithoutId = Ebay.Server.Controllers.Generated.ProductWithoutId;

namespace Ebay.Server.Controllers;

public class EbayControllerImplementation : IEbayController
{
    private readonly ApplicationDbContext _applicationContext;

    public EbayControllerImplementation(ApplicationDbContext applicationContext)
    {
        _applicationContext = applicationContext;
    }

    public async Task<ICollection<ProductWithId>> GetAllProductsAsync(CancellationToken cancellationToken)

    {
        var dbProducts = await _applicationContext.Products
            .OrderBy(x => x.Name).ThenBy(x => x.Id)
            .ToListAsync(cancellationToken);

        return dbProducts.Select(x => x.ToApiProduct()).ToList();
    }

    public async Task<Guid> CreateProductAsync(
        ProductWithoutId product,
        CancellationToken cancellationToken)
    {
        var id = Guid.NewGuid();
        await _applicationContext.Products.AddAsync(
            entity: product.ToDbProduct(id),
            cancellationToken: cancellationToken);
        await _applicationContext.SaveChangesAsync(cancellationToken);
        return id;
    }

    public async Task UpdateProductAsync(
        ProductWithoutId product,
        Guid id,
        CancellationToken cancellationToken)
    {
        var dbProduct = _applicationContext.Products.Attach(new DbProduct { Id = id });
        dbProduct.Entity.Name = product.Name;
        dbProduct.Entity.SearchQuery = product.SearchQuery;
        await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteProductAsync(Guid id, CancellationToken cancellationToken)
    {
        var product = _applicationContext.Products.Attach(new DbProduct { Id = id });
        product.State = EntityState.Deleted;
        await _applicationContext.SaveChangesAsync(cancellationToken);
    }



    public async Task UpsertLotInfoAsync(
        LotInfo lotInfo,
        Guid productId,
        CancellationToken cancellationToken)
    {
        var dbLotInfo = lotInfo.ToDbLot(productId: productId, updateDate: DateTime.UtcNow);

        

        using var transaction = new TransactionScope(
            scopeOption: TransactionScopeOption.Required,
            asyncFlowOption: TransactionScopeAsyncFlowOption.Enabled,
            transactionOptions: new TransactionOptions
                { IsolationLevel = IsolationLevel.ReadCommitted });

        await _applicationContext.Lots.Upsert(dbLotInfo).RunAsync(cancellationToken);

        if (!lotInfo.IgnoreThatLot)
        {
            var dbPurchaseHistory = lotInfo.PurchaseHistory
                .Select(x => x.ToDbPurchase(lotId: lotInfo.LotId)).ToList();
            await _applicationContext.Purchases.UpsertRange(dbPurchaseHistory).RunAsync(cancellationToken);
        }

        transaction.Complete();
    }

    public async Task<LotInfoWithProductId> GetLotInfoAsync(
        long lotId,
        CancellationToken cancellationToken)
    {
        var dbLot = await _applicationContext.Lots.Include(x => x.Purchases).SingleOrDefaultAsync(
            x => x.Id == lotId,
            cancellationToken: cancellationToken);

        if (dbLot == null)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        return dbLot.ToApiLot();
    }

    public async Task<ICollection<LotState>> GetLotStatesAsync(
        IEnumerable<long> lotIds,
        CancellationToken cancellationToken)
    {
        var idsToSelect = lotIds.ToHashSet();
        var result = await _applicationContext.Lots.Where(x => idsToSelect.Contains(x.Id))
            .Select(x => new { x.Id, x.UpdateDate, x.IgnoreThatLot }).ToListAsync(cancellationToken);

        return result.Select(
            x => new LotState(ignoreThatLot: x.IgnoreThatLot, lastUpdate: x.UpdateDate.ToString(WellKnown.Formats.TimeFormat), lotId: x.Id)).ToList();
    }

    public Task<ICollection<ManualCondition>> GetManualConditionsListAsync(
        CancellationToken cancellationToken) =>
        Task.FromResult<ICollection<ManualCondition>>(new List<ManualCondition>
        {
            new(description: "NEW, Matched", id: "newAndMatched"),
            new(description: "NEW, Tested", id: "newAndTested"),
            new(description: "NEW", id: "newNotTested"),
            new(description: "USED, Matched", id: "usedAndMatched"),
            new(description: "USED, Tested", id: "usedAndTested"),
            new(description: "USED", id: "usedAndNotTested"),
            new(description: "NOT WORKING", id: "notWorking")
        });
}