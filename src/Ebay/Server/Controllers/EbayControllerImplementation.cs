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
            .AsNoTracking()
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
        dbProduct.Entity.Weight = product.Weight;

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
        var product = await _applicationContext.Products
            .AsNoTracking()
            .Include(x => x.SearchQueries)
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
        var lot = new Lot { Id = lotId };

        _applicationContext.Lots.Attach(lot);
        _applicationContext.Lots.Remove(lot);

        await _applicationContext.SaveChangesAsync(cancellationToken);
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
    )
    {
        // тарифы взяты отсюда https://post.kz/rates/individual
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
                                new(minWeight: 0, maxWeight: 500, price: 6_400),
                                new(minWeight: 500, maxWeight: 1000, price: 11_000),
                                new(minWeight: 1000, maxWeight: 2000, price: 19_900),
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
                        new( // 3
                            rates: new List<ShippingRate>
                            {
                                new(minWeight: 0, maxWeight: 2000, price: 11_300),
                                new(minWeight: 2000, maxWeight: 3000, price: 16_150),
                                new(minWeight: 3000, maxWeight: 4000, price: 20_550),
                                new(minWeight: 4000, maxWeight: 5000, price: 25_150),
                                new(minWeight: 5000, maxWeight: 6000, price: 29_600),
                            },
                            specifiedCountries: new List<string>()
                            {
                                "DE", "IT", "FR", "GB", "PL", "RO", "SK", "EE", "LT", "BG", "LV"
                            }
                        ),
                        new( //4
                            rates: new List<ShippingRate>
                            {
                                new(minWeight: 0, maxWeight: 2000, price: 11_450),
                                new(minWeight: 2000, maxWeight: 3000, price: 17_650),
                                new(minWeight: 3000, maxWeight: 4000, price: 23_450),
                                new(minWeight: 4000, maxWeight: 5000, price: 29_400),
                                new(minWeight: 5000, maxWeight: 6000, price: 35_100),
                            },
                            specifiedCountries: new List<string>
                            {
                                "US",
                            }
                        ),
                        new( //5
                            rates: new List<ShippingRate>
                            {
                                new(minWeight: 0, maxWeight: 2000, price: 13_200),
                                new(minWeight: 2000, maxWeight: 3000, price: 22_250),
                                new(minWeight: 3000, maxWeight: 4000, price: 30_650),
                                new(minWeight: 4000, maxWeight: 5000, price: 38_800),
                                new(minWeight: 5000, maxWeight: 6000, price: 47_000),
                            },
                            specifiedCountries: new List<string>
                            {
                                "AU",
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
}