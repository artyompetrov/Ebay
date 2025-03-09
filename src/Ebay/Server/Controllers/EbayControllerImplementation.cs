using System.Transactions;
using MassTransit;
using Server.Controllers.Generated;
using Server.Data;
using Server.Data.Models;
using Server.Infrastructure;
using Server.Services;
using Microsoft.EntityFrameworkCore;
using Server.Consumers;
using ClientErrorInfo = Server.Controllers.Generated.ClientErrorInfo;
using Currency = Server.Controllers.Generated.Currency;
using DbProduct = Server.Data.Models.Product;
using LotInfo = Server.Controllers.Generated.LotInfo;
using LotInfoShort = Server.Controllers.Generated.LotInfoShort;
using LotInfoWithProductId = Server.Controllers.Generated.LotInfoWithProductId;
using LotState = Server.Controllers.Generated.LotState;
using ProductWithId = Server.Controllers.Generated.ProductWithId;
using ProductWithoutId = Server.Controllers.Generated.ProductWithoutId;

namespace Server.Controllers;

internal class EbayControllerImplementation : IEbayController
{
    private readonly ApplicationDbContext _applicationContext;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ShippingRatesService _shippingRatesService;

    public EbayControllerImplementation(ApplicationDbContext applicationContext, IPublishEndpoint publishEndpoint, ShippingRatesService shippingRatesService)
    {
        _applicationContext = applicationContext;
        _publishEndpoint = publishEndpoint;
        _shippingRatesService = shippingRatesService;
    }

    public async Task<ICollection<ProductWithId>> GetAllProductsAsync(CancellationToken cancellationToken)

    {
        var dbProducts = await _applicationContext.Products
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ThenBy(x => x.Id)
            .Include(x => x.SearchQueries)
            .Include(x => x.RuSearchQueries)
            .ToListAsync(cancellationToken);

        return dbProducts.Select(x => x.ToApiProduct()).ToList();
    }

    public async Task<Guid> CreateProductAsync(
        ProductWithoutId product,
        CancellationToken cancellationToken
    )
    {
        var newProductId = Guid.NewGuid();

        using var transaction = new TransactionScope(
            scopeOption: TransactionScopeOption.Required,
            asyncFlowOption: TransactionScopeAsyncFlowOption.Enabled,
            transactionOptions: new TransactionOptions
            { IsolationLevel = IsolationLevel.ReadCommitted }
        );
        
        await _applicationContext.Products.AddAsync(
            entity: product.ToDbProduct(newProductId),
            cancellationToken: cancellationToken
        );

        await _applicationContext.SearchQueries.AddRangeAsync(
            entities: product.SearchQueries.Select(x => x.ToDbSearchQuery(newProductId)),
            cancellationToken: cancellationToken
        );

        await _applicationContext.RuSearchQueries.AddRangeAsync(
            entities: product.RuSearchQueries.Select(x => x.ToDbRuSearchQuery(newProductId)),
            cancellationToken: cancellationToken
        );
        
        await _applicationContext.SaveChangesAsync(cancellationToken);

        transaction.Complete();

        return newProductId;
    }

    public async Task UpdateProductAsync(
        ProductWithoutId product,
        Guid id,
        CancellationToken cancellationToken
    )
    {
        using var transaction = new TransactionScope(
            scopeOption: TransactionScopeOption.Required,
            asyncFlowOption: TransactionScopeAsyncFlowOption.Enabled,
            transactionOptions: new TransactionOptions
            { IsolationLevel = IsolationLevel.ReadCommitted }
        );

        var dbProduct = _applicationContext.Products.Attach(new DbProduct { Id = id });
        dbProduct.Entity.Name = product.Name;
        dbProduct.Entity.Weight = product.Weight;

        _applicationContext.RemoveRange(_applicationContext.SearchQueries.Where(x => x.ProductId == id));
        _applicationContext.RemoveRange(_applicationContext.RuSearchQueries.Where(x => x.ProductId == id));

        await _applicationContext.SearchQueries.AddRangeAsync(
            entities: product.SearchQueries.Select(x => x.ToDbSearchQuery(id)),
            cancellationToken: cancellationToken
        );
        
        await _applicationContext.RuSearchQueries.AddRangeAsync(
            entities: product.RuSearchQueries.Select(x => x.ToDbRuSearchQuery(id)),
            cancellationToken: cancellationToken
        );
        
        await _publishEndpoint.Publish(new CalculatePricesForProduct(id), cancellationToken);
        
        await _applicationContext.SaveChangesAsync(cancellationToken);

        transaction.Complete();
    }

    public async Task<ProductWithId> GetProductAsync(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var product = await _applicationContext.Products
            .AsNoTracking()
            .Include(x => x.SearchQueries)
            .Include(x => x.RuSearchQueries)
            .SingleOrDefaultAsync(predicate: x => x.Id == id, cancellationToken: cancellationToken);

        if (product == null)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        return product.ToApiProduct();
    }

    public async Task DeleteProductAsync(Guid id, CancellationToken cancellationToken)
    {
        var product = _applicationContext.Products.Attach(new DbProduct { Id = id });
        product.State = EntityState.Deleted;
        await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    public async Task MarkProductAsCheckedAsync(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var dbProduct = _applicationContext.Products.Attach(new DbProduct { Id = id });
        dbProduct.Entity.LastCheckTime = DateTime.UtcNow;

        await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<ICollection<LotInfoShort>> GetLotsAsync(
        string? conditions,
        string? testStates,
        bool? onlyRecentSales,
        Guid productId,
        CancellationToken cancellationToken
    )
    {
        var exist = await _applicationContext.Products
            .AsNoTracking()
            .AnyAsync(predicate: x => x.Id == productId, cancellationToken: cancellationToken);

        if (exist == false)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        var conditionsSplitted = conditions?.Split(
                separator: ",",
                options: StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries
            )
            .ToHashSet();
        var testStatesSplitted = testStates?.Split(
                separator: ",",
                options: StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries
            )
            .ToHashSet();

        var result = new List<LotInfoShort>();

        foreach (var lot in _applicationContext.Lots
            .AsNoTracking()
            .Include(x => x.Purchases)
            .Where(x => x.ProductId == productId))
        {
            if (conditionsSplitted != null &&
                !conditionsSplitted.Contains(lot.Categories[WellKnown.Categories.Conditions.CategoryName]))
                continue;
            if (testStatesSplitted != null &&
                !testStatesSplitted.Contains(lot.Categories[WellKnown.Categories.TestState.CategoryName]))
                continue;

            if (onlyRecentSales == true)
            {
                var titleChangeDate = lot.TitleChangeDate;
                lot.Purchases = lot.Purchases.Where(x => x.Date > titleChangeDate).ToList();
            }

            result.Add(lot.ToApiLotInfoShort());
        }

        return result;
    }

    public async Task UpsertLotInfoAsync(
        LotInfo lotInfo,
        Guid productId,
        CancellationToken cancellationToken
    )
    {
        var validationErrors = new Dictionary<string, string[]>();
        if (lotInfo.ShippingAdditional == null)
        {
            validationErrors.Add(key: nameof(lotInfo.ShippingAdditional), value: new[] { "Not set" });
        }

        if (lotInfo.Shipping == null)
        {
            validationErrors.Add(key: nameof(lotInfo.Shipping), value: new[] { "Not set" });
        }

        if (!new HashSet<string> { WellKnown.Categories.Conditions.CategoryName, WellKnown.Categories.TestState.CategoryName }.SequenceEqual(
                lotInfo.Categories.Select(x => x.Type)
            ))
        {
            validationErrors.Add(key: nameof(lotInfo.Categories), value: new[] { "Not all categories set" });
        }

        if (validationErrors.Count > 0)
        {
            throw NonOkHttpAnswerException.ValidationError400(validationErrors);
        }

        var dbLotInfo = lotInfo.ToDbLot(productId: productId, updateDate: DateTime.UtcNow);

        using var transaction = new TransactionScope(
            scopeOption: TransactionScopeOption.Required,
            asyncFlowOption: TransactionScopeAsyncFlowOption.Enabled,
            transactionOptions: new TransactionOptions
            { IsolationLevel = IsolationLevel.ReadCommitted }
        );

        await _applicationContext.Lots.Upsert(dbLotInfo).RunAsync(cancellationToken);


        var dbPurchaseHistory = lotInfo.PurchaseHistory
            .Select(x => x.ToDbPurchase(lotId: lotInfo.LotId))
            .ToList();
        await _applicationContext.Purchases.UpsertRange(dbPurchaseHistory).RunAsync(cancellationToken);

        _applicationContext.RemoveRange(
            _applicationContext.IgnoredLots.Where(x => x.ProductId == productId && x.LotId == lotInfo.LotId)
        );

        await _publishEndpoint.Publish(new CalculatePricesForLot(lotInfo.LotId), cancellationToken);
        await _applicationContext.SaveChangesAsync(cancellationToken);
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

    public async Task IgnoreLotsAsync(
        IEnumerable<long> ignoredLots,
        Guid productId,
        CancellationToken cancellationToken
    )
    {
        using var transaction = new TransactionScope(
            scopeOption: TransactionScopeOption.Required,
            asyncFlowOption: TransactionScopeAsyncFlowOption.Enabled,
            transactionOptions: new TransactionOptions
            { IsolationLevel = IsolationLevel.Serializable }
        );

        var lotIds = ignoredLots.ToList();

        var alreadySaved = await _applicationContext.Lots
            .AnyAsync(predicate: x => x.ProductId == productId && lotIds.Contains(x.Id), cancellationToken: cancellationToken);

        if (!alreadySaved)
        {
            await _applicationContext.IgnoredLots
                .UpsertRange(lotIds.Select(x => new IgnoredLot { ProductId = productId, LotId = x }))
                .RunAsync(cancellationToken);
        }

        transaction.Complete();
    }

    public async Task<bool> GetIsLotIgnoredForProductAsync(
        Guid productId,
        long lotId,
        CancellationToken cancellationToken
    )
    {
        var dbLot = await _applicationContext.IgnoredLots.AnyAsync(x => x.LotId == lotId && x.ProductId == productId);

        return dbLot;
    }


    public async Task<LotInfoWithProductId> GetLotInfoAsync(
        long lotId,
        CancellationToken cancellationToken
    )
    {
        var dbLot = await _applicationContext.Lots
            .AsNoTracking()
            .Include(x => x.Purchases)
            .SingleOrDefaultAsync(
                predicate: x => x.Id == lotId,
                cancellationToken: cancellationToken
            );

        if (dbLot == null)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        return dbLot.ToApiLot();
    }

    public async Task DeleteLotInfoAsync(long lotId, CancellationToken cancellationToken)
    {
        using var transaction = new TransactionScope(
            scopeOption: TransactionScopeOption.Required,
            asyncFlowOption: TransactionScopeAsyncFlowOption.Enabled,
            transactionOptions: new TransactionOptions { IsolationLevel = IsolationLevel.Serializable }
        );

        var lot = await _applicationContext.Lots
                      .SingleOrDefaultAsync(predicate: x => x.Id == lotId, cancellationToken: cancellationToken) ??
                  throw new InvalidOperationException($"Lot with id {lotId} not found");

        await _publishEndpoint.Publish(new CalculatePricesForProduct(lot.ProductId), cancellationToken);
        
        _applicationContext.Lots.Remove(lot);
        await _applicationContext.SaveChangesAsync(cancellationToken);

        transaction.Complete();
    }

    public async Task<ICollection<long>> GetLotIdsAsync(CancellationToken cancellationToken)
    {
        var result = await _applicationContext.Lots
            .AsNoTracking()
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        return result;
    }

    public async Task<ICollection<LotState>> GetLotStatesAsync(
        IEnumerable<long> lotIds,
        CancellationToken cancellationToken
    )
    {
        var idsToSelect = lotIds.ToHashSet();
        var result = await _applicationContext.Lots
            .AsNoTracking()
            .Where(x => idsToSelect.Contains(x.Id))
            .Select(x => new { x.Id, x.UpdateDate })
            .ToListAsync(cancellationToken);

        return result.Select(
                x => new LotState(
                    lastUpdate: x.UpdateDate.ToString(WellKnown.Formats.TimeFormat),
                    lotId: x.Id
                )
            )
            .ToList();
    }

    public Task<ICollection<CategoryType>> GetCategoriesAsync(
        CancellationToken cancellationToken
    ) =>
        Task.FromResult<ICollection<CategoryType>>(
            new List<CategoryType>
            {
                new(
                    items: new List<CategoryItem>
                    {
                        new(description: "NEW", id: WellKnown.Categories.Conditions.New),
                        new(description: "USED", id: WellKnown.Categories.Conditions.Used),
                        new(description: "NOT WORKING", id: WellKnown.Categories.Conditions.NotWorking)
                    },
                    type: "condition"
                ),

                new(
                    items: new List<CategoryItem>
                    {
                        new(description: "Not tested", id: WellKnown.Categories.TestState.NotTested),
                        new(description: "Tested", id: WellKnown.Categories.TestState.Tested),
                        new(description: "Mathced", id: WellKnown.Categories.TestState.Matched)
                    },
                    type: "test_state"
                )
            }
        );

    public Task<ICollection<ShippingType>> GetShippingRatesAsync(
        CancellationToken cancellationToken
    ) =>
        Task.FromResult(_shippingRatesService.GetShippingRates());

    public async Task<ICollection<Currency>> GetCurrenciesAsync(
        CancellationToken cancellationToken
    )
    {
        return (await _applicationContext.Currencies
                .AsNoTracking()
                .OrderBy(x => x.CurrencyEbayName)
                .ToListAsync(cancellationToken))
            .Select(x => x.ToApiCurrency())
            .ToList();
    }

    public Task<ICollection<ExtractedFields>> ExtractDataAsync(
        LotDataToExtract lotInfo,
        CancellationToken cancellationToken
    )
    {
        return Task.FromResult(
            ManualFieldsExtractor.ExtractManualData(lotInfo).ToApiExtractedData()
        );
    }

    public async Task SaveErrorAsync(ClientErrorInfo error, CancellationToken cancellationToken)
    {
        _applicationContext.ClientErrors.Add(error.ToDbClientError());
        await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    public async Task CalculatePricesForAllAsync(CancellationToken cancellationToken = default(CancellationToken))
    {
        await _publishEndpoint.Publish(new CalculatePricesForAll());
    }
}