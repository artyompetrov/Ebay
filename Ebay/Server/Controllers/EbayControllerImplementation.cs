using System.Transactions;
using Ebay.Server.Controllers.Generated;
using Ebay.Server.Data;
using Ebay.Server.Data.Models;
using Ebay.Server.Infrastructure;
using Ebay.Server.Services;
using Microsoft.EntityFrameworkCore;
using ClientErrorInfo = Ebay.Server.Controllers.Generated.ClientErrorInfo;
using Currency = Ebay.Server.Controllers.Generated.Currency;
using DbProduct = Ebay.Server.Data.Models.Product;
using LotInfo = Ebay.Server.Controllers.Generated.LotInfo;
using LotInfoShort = Ebay.Server.Controllers.Generated.LotInfoShort;
using LotInfoWithProductId = Ebay.Server.Controllers.Generated.LotInfoWithProductId;
using LotState = Ebay.Server.Controllers.Generated.LotState;
using ProductWithId = Ebay.Server.Controllers.Generated.ProductWithId;
using ProductWithoutId = Ebay.Server.Controllers.Generated.ProductWithoutId;

namespace Ebay.Server.Controllers;

internal class EbayControllerImplementation : IEbayController
{
    private readonly ApplicationDbContext _applicationContext;

    public EbayControllerImplementation(ApplicationDbContext applicationContext)
    {
        _applicationContext = applicationContext;
    }

    public async Task<ICollection<ProductWithId>> GetAllProductsAsync(CancellationToken cancellationToken)

    {
        var dbProducts = await _applicationContext.Products
            .OrderBy(x => x.Name)
            .ThenBy(x => x.Id)
            .Include(x => x.SearchQueries)
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

        _applicationContext.RemoveRange(_applicationContext.SearchQueries.Where(x => x.ProductId == id));

        await _applicationContext.SearchQueries.AddRangeAsync(
            entities: product.SearchQueries.Select(x => x.ToDbSearchQuery(id)),
            cancellationToken: cancellationToken
        );

        await _applicationContext.SaveChangesAsync(cancellationToken);

        transaction.Complete();
    }

    public async Task<ProductWithId> GetProductAsync(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var product = await _applicationContext.Products.Include(x => x.SearchQueries)
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken: cancellationToken);

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

    public async Task<ICollection<LotInfoShort>> GetLotsAsync(Guid productId, CancellationToken cancellationToken)
    {
        var product = await _applicationContext.Products.Include(x => x.Lots)
            .ThenInclude(x => x.Purchases)
            .SingleOrDefaultAsync(x => x.Id == productId, cancellationToken: cancellationToken);

        if (product == null)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        return product.Lots.Select(x => x.ToApiLotInfoShort()).ToList();
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
            validationErrors.Add(nameof(lotInfo.ShippingAdditional), new[] { "Not set" });
        }

        if (lotInfo.Shipping == null)
        {
            validationErrors.Add(nameof(lotInfo.Shipping), new[] { "Not set" });
        }

        if (!new HashSet<string> { "condition", "test_state" }.SequenceEqual(
                lotInfo.Categories.Select(x => x.Type)
            ))
        {
            validationErrors.Add(nameof(lotInfo.Categories), new[] { "Not all categories set" });
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

        await _applicationContext.SaveChangesAsync(cancellationToken);
        transaction.Complete();
    }

    public async Task<ICollection<long>> GetIgnoredLotsAsync(Guid productId, CancellationToken cancellationToken)
    {
        var ignoredLots = await _applicationContext.IgnoredLots.Where(x => x.ProductId == productId)
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
            .AnyAsync(x => x.ProductId == productId && lotIds.Contains(x.Id), cancellationToken);

        if (!alreadySaved)
        {
            await _applicationContext.IgnoredLots
                .UpsertRange(lotIds.Select(x => new IgnoredLot { ProductId = productId, LotId = x }))
                .RunAsync(cancellationToken);
        }
        
        transaction.Complete();
    }


    public async Task<LotInfoWithProductId> GetLotInfoAsync(
        long lotId,
        CancellationToken cancellationToken
    )
    {
        var dbLot = await _applicationContext.Lots.Include(x => x.Purchases)
            .SingleOrDefaultAsync(
                x => x.Id == lotId,
                cancellationToken: cancellationToken
            );

        if (dbLot == null)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        return dbLot.ToApiLot();
    }

    public async Task<ICollection<long>> GetLotIdsAsync(CancellationToken cancellationToken)
    {
        var result = await _applicationContext.Lots
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
        var result = await _applicationContext.Lots.Where(x => idsToSelect.Contains(x.Id))
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
                        new("NEW", WellKnown.Conditions.New),
                        new("USED", WellKnown.Conditions.Used),
                        new("NOT WORKING", WellKnown.Conditions.NotWorking)
                    },
                    type: "condition"
                ),

                new(
                    items: new List<CategoryItem>
                    {
                        new("Not tested", WellKnown.States.NotTested),
                        new("Tested", WellKnown.States.Tested),
                        new("Mathced", WellKnown.States.Matched)
                    },
                    type: "test_state"
                )
            }
        );

    public Task<ICollection<ShippingType>> GetShippingRatesAsync(
        CancellationToken cancellationToken
    )
    {
        return Task.FromResult<ICollection<ShippingType>>(
            new List<ShippingType>
            {
                new(
                    name: "Мелкий пакет авиа",
                    currency: WellKnown.Currencies.KZT,
                    rates: new List<ShippingRates>
                    {
                        new(
                            rates: new List<ShippingRate>
                            {
                                new(minWeight: 0, maxWeight: 500, price: 5_100),
                                new(minWeight: 501, maxWeight: 1000, price: 8_700),
                                new(minWeight: 1001, maxWeight: 2000, price: 15_900),
                            },
                            specifiedCountries: null
                        )
                    }
                ),
                new(
                    name: "Посылка авиа",
                    currency: WellKnown.Currencies.KZT,
                    rates: new List<ShippingRates>
                    {
                        new(
                            rates: new List<ShippingRate>
                            {
                                new(minWeight: 0, maxWeight: 2000, price: 9_900),
                                new(minWeight: 2001, maxWeight: 3000, price: 13_250),
                                new(minWeight: 3001, maxWeight: 4000, price: 16_560),
                                new(minWeight: 4001, maxWeight: 5000, price: 20_010),
                                new(minWeight: 5001, maxWeight: 6000, price: 23_230),
                            },
                            specifiedCountries: new List<string>()
                            {
                                "Germany", "Italy", "France", "United Kingdom",
                            }
                        ),
                        new(
                            rates: new List<ShippingRate>
                            {
                                new(minWeight: 0, maxWeight: 2000, price: 9_780),
                                new(minWeight: 2001, maxWeight: 3000, price: 14_950),
                                new(minWeight: 3001, maxWeight: 4000, price: 18_630),
                                new(minWeight: 4001, maxWeight: 5000, price: 22_430),
                                new(minWeight: 5001, maxWeight: 6000, price: 26_680),
                            },
                            specifiedCountries: new List<string>
                            {
                                "United States",
                            }
                        )
                    }
                ),
            }
        );
    }

    public async Task<ICollection<Currency>> GetCurrenciesAsync(
        CancellationToken cancellationToken
    )
    {
        return (await _applicationContext.Currencies.OrderBy(x => x.CurrencyEbayName).ToListAsync(cancellationToken))
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
}