using System.Transactions;
using Ebay.Server.Controllers.Generated;
using Ebay.Server.Data;
using Ebay.Server.Data.Models;
using Ebay.Server.Infrastructure;
using Microsoft.EntityFrameworkCore;
using DbProduct = Ebay.Server.Data.Models.Product;

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
        Guid id,
        CancellationToken cancellationToken)
    {
        var dbLotInfo = lotInfo.ToDbLot();

        var dbPurchaseHistory = lotInfo.PurchaseHistory
            .Select(x => x.ToDbPurchase(lotId: lotInfo.LotId)).ToList();

        using var transaction = new TransactionScope(
            scopeOption: TransactionScopeOption.Required,
            asyncFlowOption: TransactionScopeAsyncFlowOption.Enabled,
            transactionOptions: new TransactionOptions
                { IsolationLevel = IsolationLevel.ReadCommitted });

        await _applicationContext.Lots.Upsert(dbLotInfo).RunAsync(cancellationToken);
        await _applicationContext.Purchases.UpsertRange(dbPurchaseHistory).RunAsync(cancellationToken);

        transaction.Complete();
    }
}