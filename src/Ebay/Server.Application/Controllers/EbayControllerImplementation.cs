using MassTransit;
using Microsoft.EntityFrameworkCore;
using Server.Application.Consumers.PriceCalculator;
using Server.Application.Data;
using Server.Application.Infrastructure;
using Server.Application.Services;
using Server.Application.Services.LotDataExtractor;
using Server.Application.Services.Measurement;
using Server.Controllers.Generated;
using Server.Domain;
using Server.Domain.Exceptions;
using Server.Domain.Measurements;
using ApiSimilarMeasurementInfo = Server.Controllers.Generated.SimilarMeasurementInfo;
using ClientErrorInfo = Server.Controllers.Generated.ClientErrorInfo;
using Currency = Server.Controllers.Generated.Currency;
using DbProduct = Server.Domain.Product;
using LotInfo = Server.Controllers.Generated.LotInfo;
using LotInfoShort = Server.Controllers.Generated.LotInfoShort;
using LotInfoWithProductId = Server.Controllers.Generated.LotInfoWithProductId;
using LotState = Server.Controllers.Generated.LotState;
using MeasurementData = Server.Controllers.Generated.MeasurementData;
using MeasurementState = Server.Controllers.Generated.MeasurementState;
using ProductPassportInfo = Server.Controllers.Generated.ProductPassportInfo;
using ProductPassportUpload = Server.Controllers.Generated.ProductPassportUpload;
using ProductWithId = Server.Controllers.Generated.ProductWithId;
using ProductWithoutId = Server.Controllers.Generated.ProductWithoutId;
using SaleAdvertisement = Server.Controllers.Generated.SaleAdvertisement;
using SearchQuery = Server.Domain.SearchQuery;
using TubeWorkingPoint = Server.Controllers.Generated.TubeWorkingPoint;

namespace Server.Application.Controllers;

internal class EbayControllerImplementation : IEbayController
{
    private readonly ApplicationDbContext _applicationContext;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ShippingRatesService _shippingRatesService;
    private readonly MeasurementService _measurementService;
    private readonly MatchedMeasurementService _matchedMeasurementService;
    private readonly TubeWorkingPointService _tubeWorkingPointService;
    private readonly ProductService _productService;

    public EbayControllerImplementation(
        ApplicationDbContext applicationContext,
        IPublishEndpoint publishEndpoint,
        ShippingRatesService shippingRatesService,
        MeasurementService measurementService,
        MatchedMeasurementService matchedMeasurementService,
        TubeWorkingPointService tubeWorkingPointService,
        ProductService productService
        )
    {
        _applicationContext = applicationContext;
        _publishEndpoint = publishEndpoint;
        _shippingRatesService = shippingRatesService;
        _measurementService = measurementService;
        _matchedMeasurementService = matchedMeasurementService;
        _tubeWorkingPointService = tubeWorkingPointService;
        _productService = productService;
    }

    public async Task<ICollection<ProductPassportInfo>> GetProductPassportsAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {
        return await _applicationContext.ProductPassports
            .AsNoTracking()
            .Where(x => x.ProductId == productId)
            .OrderBy(x => x.Order)
            .Select(x => new ProductPassportInfo(x.FileName, x.Id, x.Order))
            .ToListAsync(cancellationToken);
    }

    public async Task UploadProductPassportAsync(
        ProductPassportUpload passport,
        Guid productId,
        CancellationToken cancellationToken)
    {
        var order = passport.Order ??
            ((await _applicationContext.ProductPassports
                .Where(x => x.ProductId == productId)
                .Select(x => (int?)x.Order)
                .MaxAsync(cancellationToken)) ?? -1) + 1;

        var entity = new ProductPassport
        {
            Id = Guid.NewGuid(),
            ProductId = productId,
            FileName = passport.FileName,
            ContentType = passport.ContentType,
            Order = order,
            Content = passport.File
        };

        await _applicationContext.ProductPassports.AddAsync(entity, cancellationToken);
        await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteProductPassportAsync(
        Guid productId,
        Guid passportId,
        CancellationToken cancellationToken)
    {
        var passport = await _applicationContext.ProductPassports
            .SingleOrDefaultAsync(x => x.ProductId == productId && x.Id == passportId, cancellationToken);

        if (passport == null)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        var order = passport.Order;

        _applicationContext.ProductPassports.Remove(passport);

        var passportsToUpdate = await _applicationContext.ProductPassports
            .Where(x => x.ProductId == productId && x.Order > order)
            .ToListAsync(cancellationToken);

        foreach (var p in passportsToUpdate)
        {
            p.Order--;
        }

        await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<TubeWorkingPoint> GetTubeWorkingPointAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {
        var workingPoint = await _tubeWorkingPointService.GetWorkingPointInfo(productId, cancellationToken);

        if (workingPoint == null)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        return workingPoint.ToApiTubeWorkingPoint();
    }

    public async Task UpsertTubeWorkingPointAsync(
        TubeWorkingPoint workingPoint,
        Guid productId,
        CancellationToken cancellationToken)
    {
        try
        {
            await _tubeWorkingPointService.CreateTubeWorkingPoint(
                tubeProductId: productId,
                anodeVoltage: workingPoint.AnodeVoltage,
                gridVoltage: workingPoint.GridVoltage,
                anodeVoltageHalfWidth: workingPoint.AnodeVoltageHalfWidth,
                gridVoltageHalfWidth: workingPoint.GridVoltageHalfWidth,
                nominalCurrent: workingPoint.NominalCurrent,
                cancellationToken: cancellationToken);
        }
        catch (DomainException ex)
        {
            throw NonOkHttpAnswerException.ValidationError400(nameof(workingPoint), errors: [ex.Message]);
        }
    }

    public async Task UpdateProductPassportAsync(
        ProductPassportUpdate passport,
        Guid productId,
        Guid passportId,
        CancellationToken cancellationToken)
    {
        var entity = await _applicationContext.ProductPassports
            .SingleOrDefaultAsync(x => x.ProductId == productId && x.Id == passportId, cancellationToken);

        if (entity == null)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        if (entity.Order == passport.Order)
        {
            return;
        }

        var minOrder = Math.Min(entity.Order, passport.Order);
        var maxOrder = Math.Max(entity.Order, passport.Order);

        var affected = await _applicationContext.ProductPassports
            .Where(x => x.ProductId == productId && x.Id != passportId && x.Order >= minOrder && x.Order <= maxOrder)
            .ToListAsync(cancellationToken);

        if (passport.Order < entity.Order)
        {
            foreach (var p in affected)
            {
                p.Order++;
            }
        }
        else
        {
            foreach (var p in affected)
            {
                p.Order--;
            }
        }

        entity.Order = passport.Order;
        await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<ICollection<ProductWithId>> GetAllProductsAsync(CancellationToken cancellationToken)
    {
        var products = await _productService.GetAllProductsAsync(cancellationToken);

        return products.Select(x => x.ToApiProduct()).ToList();
    }

    public async Task<Guid> CreateProductAsync(
        ProductWithoutId product,
        CancellationToken cancellationToken
    )
    {
        return (await _productService.CreateProductAsync(
            name: product.Name,
            weight: product.Weight,
            searchQueries: product.SearchQueries.Select(x=>x.Query).ToList(),
            ruSearchQueries: product.RuSearchQueries.Select(x=>x.Query).ToList(),
            cancellationToken: cancellationToken)).Id;
    }

    public async Task UpdateProductAsync(
        ProductWithoutId product,
        Guid id,
        CancellationToken cancellationToken
    )
    {
        await _productService.UpdateProductAsync(
            productId: id,
            name: product.Name,
            weight: product.Weight,
             searchQueries: product.SearchQueries.Select(x => new SearchQueryWithId(x.Id, x.Query)).ToList(),
             ruSearchQueries: product.RuSearchQueries.Select(x => new SearchQueryWithId(x.Id, x.Query)).ToList(),
            
            cancellationToken: cancellationToken);
    }

    public async Task<ProductWithId> GetProductAsync(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var product = await _productService.GetProductAsync(id, cancellationToken);
        
        if (product == null)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }
        
        return product.ToApiProduct();
    }

    public async Task DeleteProductAsync(Guid id, CancellationToken cancellationToken)
    {
        await _productService.DeleteProductAsync(id, cancellationToken);
    }

    public async Task MarkProductAsCheckedAsync(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        await _productService.MarkProductAsCheckedAsync(id, cancellationToken);
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
                isAmbiguous: x.IsAmbiguous,
                link: x.Link,
                marketplace: x.Marketplace,
                seller: x.Seller,
                contact: x.Contact))
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
        var apiMeasurementState = measurementState.HasValue
            ? (MeasurementState)(int)measurementState.Value
            : (MeasurementState?)null;

        var measurementStates = apiMeasurementState.HasValue
            ? new[] { apiMeasurementState.Value.ToDbMeasurementState() }
            : Enum.GetValues<Server.Domain.Measurements.MeasurementState>();

        var measurements = await _measurementService.GetMeasurementInfos(
            productId: productId,
            measurementStates: measurementStates,
            cancellationToken: cancellationToken);

        var result = measurements
            .Select(x => new MeasurementData(
                doubleTriodeSectionRmse: x.DoubleTriodeSectionRmse,
                manufactureCode: x.ManufactureCode,
                measurementId: x.Id,
                productState: x.ProductState.ToApiProductState(),
                location: x.Location,
                matchId: x.MatchId,
                measurementState: x.MeasurementState.ToApiMeasurementState(),
                similarMeasurements: x.SimilarMeasurements
                    .Select(similarMeasurement => new ApiSimilarMeasurementInfo(
                        measurementId: similarMeasurement.MeasurementId,
                        manufactureCode: similarMeasurement.ManufactureCode,
                        rmseSection1: similarMeasurement.RmseSection1,
                        rmseSection2: similarMeasurement.RmseSection2,
                        score: similarMeasurement.Score,
                        isCrossMatch: similarMeasurement.ComparisonMode == ComparisonMode.Cross,
                        sameDate: x.ManufactureCode.Equals(similarMeasurement.ManufactureCode, StringComparison.OrdinalIgnoreCase),
                        isMatchedPair: similarMeasurement.IsMatchedPair,
                        matchId: similarMeasurement.MatchId
                        
                    ))
                    .ToList()))
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
            matchId: batchId,
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

    public async Task FindMatchedMeasurementsAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {
        await _matchedMeasurementService.FindMatchedMeasurementsAsync(
            productId: productId,
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