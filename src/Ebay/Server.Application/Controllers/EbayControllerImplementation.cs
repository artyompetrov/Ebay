using System.Globalization;
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
        ProductService productService)
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

        _ = await _applicationContext.ProductPassports.AddAsync(entity, cancellationToken);
        _ = await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    [Obsolete]
    public async Task DeleteProductPassportAsync(
        Guid productId,
        Guid passportId,
        CancellationToken cancellationToken)
    {
        var passport = await _applicationContext.ProductPassports
            .SingleOrDefaultAsync(x => x.ProductId == productId && x.Id == passportId, cancellationToken) ?? throw NonOkHttpAnswerException.NotFound400();
        var order = passport.Order;

        _ = _applicationContext.ProductPassports.Remove(passport);

        var passportsToUpdate = await _applicationContext.ProductPassports
            .Where(x => x.ProductId == productId && x.Order > order)
            .ToListAsync(cancellationToken);

        foreach (var p in passportsToUpdate)
        {
            p.Order--;
        }

        _ = await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    [Obsolete]
    public async Task<TubeWorkingPoint> GetTubeWorkingPointAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {
        var workingPoint = await _tubeWorkingPointService.GetWorkingPointInfo(productId, cancellationToken);

        return workingPoint == null ? throw NonOkHttpAnswerException.NotFound400() : workingPoint.ToApiTubeWorkingPoint();
    }

    [Obsolete]
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

    [Obsolete]
    public async Task UpdateProductPassportAsync(
        ProductPassportUpdate passport,
        Guid productId,
        Guid passportId,
        CancellationToken cancellationToken)
    {
        var entity = await _applicationContext.ProductPassports
            .SingleOrDefaultAsync(x => x.ProductId == productId && x.Id == passportId, cancellationToken) ?? throw NonOkHttpAnswerException.NotFound400();
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
        _ = await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<ICollection<ProductWithId>> GetAllProductsAsync(CancellationToken cancellationToken)
    {
        var products = await _productService.GetAllProductsAsync(cancellationToken);

        return [.. products.Select(x => x.ToApiProduct())];
    }

    public async Task<Guid> CreateProductAsync(
        ProductWithoutId product,
        CancellationToken cancellationToken
    )
    {
        return (await _productService.CreateProductAsync(
            name: product.Name,
            weight: product.Weight,
            searchQueries: [.. product.SearchQueries.Select(x => x.Query)],
            ruSearchQueries: [.. product.RuSearchQueries.Select(x => x.Query)],
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
             searchQueries: [.. product.SearchQueries.Select(x => new SearchQueryWithId(x.Id, x.Query))],
             ruSearchQueries: [.. product.RuSearchQueries.Select(x => new SearchQueryWithId(x.Id, x.Query))],

            cancellationToken: cancellationToken);
    }

    [Obsolete]
    public async Task<ProductWithId> GetProductAsync(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var product = await _productService.GetProductAsync(id, cancellationToken);

        return product == null ? throw NonOkHttpAnswerException.NotFound400() : product.ToApiProduct();
    }

    public async Task DeleteProductAsync(Guid id, CancellationToken cancellationToken) => await _productService.DeleteProductAsync(id, cancellationToken);

    public async Task MarkProductAsCheckedAsync(
        Guid id,
        CancellationToken cancellationToken
    ) => await _productService.MarkProductAsCheckedAsync(id, cancellationToken);

    [Obsolete]
    public async Task<ICollection<SaleAdvertisement>> GetSaleAdvertisementsAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {
        var exist = await _applicationContext.Products
            .AsNoTracking()
            .AnyAsync(x => x.Id == productId, cancellationToken);

        if (!exist)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        var ads = await _applicationContext.ProductEmailSendHistory
            .AsNoTracking()
            .Where(x => x.ProductId == productId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);

        return [.. ads
            .Select(x => new SaleAdvertisement(
                createdAt: x.CreatedAt,
                isAmbiguous: x.IsAmbiguous,
                link: x.Link,
                marketplace: x.Marketplace,
                seller: x.Seller,
                contact: x.Contact))];
    }

    [Obsolete]
    public async Task<ICollection<LotInfoShort>> GetLotsAsync(
        Guid productId,
        CancellationToken cancellationToken
    )
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

    [Obsolete]
    public async Task UpsertLotInfoAsync(
        LotInfo lotInfo,
        Guid productId,
        CancellationToken cancellationToken
    )
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

    [Obsolete]
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
            _ = await _applicationContext.IgnoredLots
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
        var dbLot = await _applicationContext.IgnoredLots.AnyAsync(x => x.LotId == lotId && x.ProductId == productId, cancellationToken: cancellationToken);

        return dbLot;
    }

    public async Task CalculatePricesForProductAsync(Guid productId, CancellationToken cancellationToken)
    {
        await _publishEndpoint.Publish(new CalculatePricesForProduct(productId), cancellationToken);
        _ = await _applicationContext.SaveChangesAsync(cancellationToken);
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
            ? [apiMeasurementState.Value.ToDbMeasurementState()]
            : Enum.GetValues<Domain.Measurements.MeasurementState>();

        var productStates = Enum.GetValues<Domain.Measurements.ProductState>();

        var measurements = await _measurementService.GetMeasurementInfos(
            productId: productId,
            productState: productStates,
            measurementStates: measurementStates,
            cancellationToken: cancellationToken);

        var result = measurements
            .Select(x => new MeasurementData(
                doubleTriodeSectionRmse: x.DoubleTriodeSectionRmse,
                manufactureCode: x.MeasurementInfo.ManufactureCode,
                measurementId: x.MeasurementInfo.Id,
                isPublishedOnEbay: x.MeasurementInfo.IsPublishedOnEbay,
                productState: x.MeasurementInfo.ProductState.ToApiProductState(),
                location: x.MeasurementInfo.Location,
                matchId: x.MeasurementInfo.MatchId,
                lotId: x.MeasurementInfo.LotId,
                measurementState: x.MeasurementInfo.MeasurementState.ToApiMeasurementState(),
                similarMeasurements: [.. x.SimilarMeasurements
                    .Select(similarMeasurement => new ApiSimilarMeasurementInfo(
                        measurementId: similarMeasurement.MeasurementId,
                        manufactureCode: similarMeasurement.ManufactureCode,
                        rmseSection1: similarMeasurement.RmseSection1,
                        rmseSection2: similarMeasurement.RmseSection2,
                        score: similarMeasurement.Score,
                        isCrossMatch: similarMeasurement.ComparisonMode == ComparisonMode.Cross,
                        sameDate: x.MeasurementInfo.ManufactureCode.Equals(similarMeasurement.ManufactureCode, StringComparison.OrdinalIgnoreCase),
                        isMatchedPair: similarMeasurement.IsMatchedPair,
                        matchId: similarMeasurement.MatchId,
                        doubleTriodeSectionRmse: similarMeasurement.DoubleTriodeSectionRmse


                    ))]))
            .ToList();

        return result;
    }

    [Obsolete]
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

    public async Task<ICollection<string?>> GetLotIdsForProductAsync(Guid productId, CancellationToken cancellationToken)
    {
        return [.. await _measurementService.GetLotIdsForProductAsync(
            productId: productId,
            cancellationToken: cancellationToken)];
    }

    public async Task DeleteMeasurementAsync(
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        await _measurementService.DeleteMeasurement(
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
            measurementId: measurementId,
            cancellationToken: cancellationToken);
    }

    public async Task UpdateMeasurementManufactureCodeAsync(
        string manufactureCode,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        await _measurementService.UpdateMeasurementManufactureCode(
            manufactureCode: manufactureCode,
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
            measurementId: measurementId,
            cancellationToken: cancellationToken);
    }

    public async Task UpdateMeasurementLotIdAsync(
        string? lotId,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        await _measurementService.UpdateMeasurementLotId(
            lotId: lotId,
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

    [Obsolete]
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

        return dbLot == null ? throw NonOkHttpAnswerException.NotFound400() : dbLot.ToApiLot();
    }

    [Obsolete]
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

        return [.. result.Select(
                x => new LotState(
                    lastUpdate: x.UpdateDate.ToString(WellKnown.Formats.TimeFormat, CultureInfo.InvariantCulture),
                    lotId: x.Id
                )
            )];
    }

    public Task<ICollection<CategoryType>> GetCategoriesAsync(
        CancellationToken cancellationToken
    )
    {
        return Task.FromResult<ICollection<CategoryType>>(
            [
                new(
                    items:
                    [
                        new(description: "NEW", id: WellKnown.Categories.Conditions.New),
                        new(description: "USED", id: WellKnown.Categories.Conditions.Used),
                        new(description: "NOT WORKING", id: WellKnown.Categories.Conditions.NotWorking)
                    ],
                    type: "condition"
                ),

                new(
                    items:
                    [
                        new(description: "Not tested", id: WellKnown.Categories.TestState.NotTested),
                        new(description: "Tested", id: WellKnown.Categories.TestState.Tested),
                        new(description: "Mathced", id: WellKnown.Categories.TestState.Matched)
                    ],
                    type: "test_state"
                )
            ]
        );
    }

    public Task<ICollection<ShippingType>> GetShippingRatesAsync(
        CancellationToken cancellationToken
    ) => Task.FromResult<ICollection<ShippingType>>([.. _shippingRatesService.ShippingRates]);

    public async Task<ICollection<Currency>> GetCurrenciesAsync(
        CancellationToken cancellationToken
    )
    {
        return [.. (await _applicationContext.Currencies
                .AsNoTracking()
                .OrderBy(x => x.CurrencyEbayName)
                .ToListAsync(cancellationToken))
            .Select(x => x.ToApiCurrency())];
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
        _ = _applicationContext.ClientErrors.Add(error.ToDbClientError());
        _ = await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    public async Task CalculatePricesForAllAsync(CancellationToken cancellationToken)
    {
        await _publishEndpoint.Publish(new CalculatePricesForAll(), cancellationToken);
        _ = await _applicationContext.SaveChangesAsync(cancellationToken);

    }


}