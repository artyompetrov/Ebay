using MassTransit;
using Microsoft.EntityFrameworkCore;
using Server.Application.Consumers;
using Server.Application.Data;
using Server.Application.Data.Models;
using Server.Application.Infrastructure;
using Server.Application.Services.LotDataExtractor;
using Server.Application.Services.Measurement;
using Server.Controllers.Generated;
using ClientErrorInfo = Server.Controllers.Generated.ClientErrorInfo;
using Currency = Server.Controllers.Generated.Currency;
using DbProduct = Server.Application.Data.Models.Product;
using FindMatchParameters = Server.Controllers.Generated.FindMatchParameters;
using LotInfo = Server.Controllers.Generated.LotInfo;
using LotInfoShort = Server.Controllers.Generated.LotInfoShort;
using LotInfoWithProductId = Server.Controllers.Generated.LotInfoWithProductId;
using LotState = Server.Controllers.Generated.LotState;
using MeasurementData = Server.Controllers.Generated.MeasurementData;
using MeasurementState = Server.Controllers.Generated.MeasurementState;
using ProductWithId = Server.Controllers.Generated.ProductWithId;
using ProductWithoutId = Server.Controllers.Generated.ProductWithoutId;
using SaleAdvertisement = Server.Controllers.Generated.SaleAdvertisement;

namespace Server.Application.Controllers;

public class EbayControllerImplementation : IEbayController
{
    private readonly ApplicationDbContext _applicationContext;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ShippingRatesService _shippingRatesService;
    private readonly MeasurementService _measurementService;
    private readonly MatchedMeasurementService _matchedMeasurementService;

    public EbayControllerImplementation(
        ApplicationDbContext applicationContext,
        IPublishEndpoint publishEndpoint,
        ShippingRatesService shippingRatesService,
        MeasurementService measurementService,
        MatchedMeasurementService matchedMeasurementService)
    {
        _applicationContext = applicationContext;
        _publishEndpoint = publishEndpoint;
        _shippingRatesService = shippingRatesService;
        _measurementService = measurementService;
        _matchedMeasurementService = matchedMeasurementService;
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

        using var transaction = TransactionScopeFactory.Create();

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
        using var transaction = TransactionScopeFactory.Create();

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

    public async Task<ICollection<SaleAdvertisement>> GetSaleAdvertisementsAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {
        var exist = await _applicationContext.Products
            .AsNoTracking()
            .AnyAsync(x => x.Id == productId, cancellationToken);

        if (exist == false)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        var ads = await _applicationContext.ProductEmailSendHistory
            .AsNoTracking()
            .Where(x => x.ProductId == productId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);

        return ads
            .Select(x => new SaleAdvertisement(
                createdAt: x.CreatedAt,
                link: x.Link,
                seller: x.Seller,
                marketplace: x.Marketplace))
            .ToList();
    }


    public async Task<ICollection<LotInfoShort>> GetLotsAsync(
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

        var lots = await _applicationContext.Lots
            .AsNoTracking()
            .Include(x => x.Purchases)
            .Where(x => x.ProductId == productId).ToListAsync(cancellationToken);

        return lots.Select(x => x.ToApiLotInfoShort()).ToList();
    }

    public async Task UpsertLotInfoAsync(
        LotInfo lotInfo,
        Guid productId,
        CancellationToken cancellationToken
    )
    {
        var validationErrors = new List<(string key, string[] value)>();
        if (lotInfo.ShippingAdditional == null)
        {
            validationErrors.Add((key: nameof(lotInfo.ShippingAdditional), value: new[] { "Not set" }));
        }

        if (lotInfo.Shipping == null)
        {
            validationErrors.Add((key: nameof(lotInfo.Shipping), value: new[] { "Not set" }));
        }

        if (!new HashSet<string> { WellKnown.Categories.Conditions.CategoryName, WellKnown.Categories.TestState.CategoryName }.SequenceEqual(
                lotInfo.Categories.Select(x => x.Type)
            ))
        {
            validationErrors.Add((key: nameof(lotInfo.Categories), value: new[] { "Not all categories set" }));
        }

        if (validationErrors.Count > 0)
        {
            throw NonOkHttpAnswerException.ValidationError400(validationErrors);
        }

        var dbLotInfo = lotInfo.ToDbLot(productId: productId, updateDate: DateTime.UtcNow);

        using var transaction = TransactionScopeFactory.Create();

        await _applicationContext.Lots.Upsert(dbLotInfo).RunAsync(cancellationToken);

        var titleChangedDate = DateTime.Parse(lotInfo.TitleChangeDate).ToUniversalTime();

        var filteredPurchaseHistory = lotInfo.PurchaseHistory
            .Select(x => x.ToDbPurchase(lotId: lotInfo.LotId))
            .Where(purchase => purchase.Date >= titleChangedDate)
            .ToList();

        await _applicationContext.Purchases.UpsertRange(filteredPurchaseHistory).RunAsync(cancellationToken);

        _applicationContext.RemoveRange(
            _applicationContext.Purchases.Where(x => x.LotId == lotInfo.LotId && x.Date < titleChangedDate)
        );

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
        using var transaction = TransactionScopeFactory.Create();

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

    public async Task CalculatePricesForProductAsync(Guid productId, CancellationToken cancellationToken)
    {
        await _publishEndpoint.Publish(new CalculatePricesForProduct(productId), cancellationToken);
        await _applicationContext.SaveChangesAsync(cancellationToken);
    }
    
    public async Task<ICollection<MeasurementData>> GetMeasurementsAsync(
        MeasurementState? measurementState,
        Guid productId,
        CancellationToken cancellationToken)
    {
        MeasurementState? apiMeasurementState = measurementState.HasValue
            ? (MeasurementState)(int)measurementState.Value
            : null;
        IReadOnlyCollection<Data.Models.MeasurementState> measurementStates = apiMeasurementState.HasValue
            ? new[] { apiMeasurementState.Value.ToDbMeasurementState() }
            : Enum.GetValues<Data.Models.MeasurementState>();

        var measurements = await _measurementService.GetMeasurementInfos(
            productId: productId,
            measurementStates: measurementStates,
            cancellationToken: cancellationToken);

        var result = measurements
            .Select(x => new MeasurementData(
                manufactureCode: x.ManufactureCode,
                measurementId: x.Id,
                productState: x.ProductState.ToApiProductState(),
                location: x.Location,
                matchId: x.MatchId,
                measurementState: x.MeasurementState.ToApiMeasurementState()))
            .ToList();

        return result;
    }

    public async Task UploadMeasurementAsync(
        MeasurementDataToUpload measurementData,
        Guid productId,
        CancellationToken cancellationToken)
    {
        try
        {
            await _measurementService.SaveMeasurement(
                measurementId: measurementData.MeasurementId,
                measurementsFile: measurementData.File,
                productState: measurementData.ProductState.ToDbProductState(),
                manufactureCode: measurementData.ManufactureCode,
                location: measurementData.Location,
                matchId: measurementData.MatchId,
                productId: productId,
                cancellationToken: cancellationToken);
        }
        catch (MeasurementException measurementException)
        {
            throw NonOkHttpAnswerException.ValidationError400(
                field: nameof(measurementData),
                measurementException.Message);
        }
    }

    public async Task DeleteMeasurementAsync(
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        await _measurementService.DeleteMeasurement(
            productId: productId,
            measurementId: measurementId,
            cancellationToken: cancellationToken);
    }

    public async Task UpdateMeasurementLocationAsync(
        string location,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        await _measurementService.UpdateMeasurementLocation(
            location: location,
            productId: productId,
            measurementId: measurementId,
            cancellationToken: cancellationToken);
    }

    public async Task UpdateMeasurementMatchIdAsync(
        string? batchId,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        await _measurementService.UpdateMeasurementMatchId(
            batchId: batchId,
            productId: productId,
            measurementId: measurementId,
            cancellationToken: cancellationToken);
    }

    public async Task UpdateMeasurementStateAsync(
        MeasurementState state,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        await _measurementService.UpdateMeasurementState(
            state: state.ToDbMeasurementState(),
            productId: productId,
            measurementId: measurementId,
            cancellationToken: cancellationToken);
    }

    public Task FindMatchedMeasurementsAsync(
        FindMatchParameters findMatchParameters,
        Guid productId,
        CancellationToken cancellationToken)
    {
        return _matchedMeasurementService.FindMatchedMeasurementsAsync(
            productId: productId,
            matchCount: findMatchParameters.MatchCount,
            measurementStates: findMatchParameters.MeasurementStates
                .Select(s => s.ToDbMeasurementState())
                .ToArray(),
            includeMeasurementsWithMatchId: findMatchParameters.IncludeExisting,
            cancellationToken: cancellationToken);
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
        using var transaction = TransactionScopeFactory.Create();

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
        Task.FromResult<ICollection<ShippingType>>(_shippingRatesService.ShippingRates.ToList());

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

    public async Task CalculatePricesForAllAsync(CancellationToken cancellationToken)
    {
        await _publishEndpoint.Publish(new CalculatePricesForAll(), cancellationToken);
        await _applicationContext.SaveChangesAsync(cancellationToken);

    }
}