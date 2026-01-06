using System.Globalization;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Queries;
using Server.Application.Abstractions.Queries.Currencies;
using Server.Application.Abstractions.Services;
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
using Currency = Server.Controllers.Generated.Currency;
using LotDataToExtract = Client.Clients.Generated.LotDataToExtract;
using LotInfo = Server.Controllers.Generated.LotInfo;
using LotInfoShort = Server.Controllers.Generated.LotInfoShort;
using LotInfoWithProductId = Server.Controllers.Generated.LotInfoWithProductId;
using LotState = Server.Controllers.Generated.LotState;
using MeasurementData = Server.Controllers.Generated.MeasurementData;
using MeasurementState = Server.Controllers.Generated.MeasurementState;
using ProductWithId = Server.Controllers.Generated.ProductWithId;
using ProductWithoutId = Server.Controllers.Generated.ProductWithoutId;
using SaleAdvertisement = Server.Controllers.Generated.SaleAdvertisement;
using TubeWorkingPoint = Server.Controllers.Generated.TubeWorkingPoint;

namespace Server.Adapters.Web.Controllers;

internal class EbayControllerImplementation : IEbayController
{
    private readonly IShippingRatesService _shippingRatesService;
    private readonly IMeasurementService _measurementService;
    private readonly IMatchedMeasurementService _matchedMeasurementService;
    private readonly ITubeWorkingPointService _tubeWorkingPointService;
    private readonly IProductService _productService;
    private readonly ISaleAdvertisementQueries _saleAdvertisementQueries;
    private readonly IManualFieldsExtractorService _manualFieldsExtractorService;
    private readonly ICurrenciesQueries _currenciesQueries;

    private readonly ILotsService _lotsService;
    private readonly ILotQueries _lotQueries;

    public EbayControllerImplementation(
        IShippingRatesService shippingRatesService,
        IMeasurementService measurementService,
        IMatchedMeasurementService matchedMeasurementService,
        ITubeWorkingPointService tubeWorkingPointService,
        IProductService productService,
        ISaleAdvertisementQueries saleAdvertisementQueries,
        IManualFieldsExtractorService manualFieldsExtractorService,
        ICurrenciesQueries currenciesQueries,
        ILotsService lotsService,
        ILotQueries lotQueries)
    {
        _shippingRatesService = shippingRatesService;
        _measurementService = measurementService;
        _matchedMeasurementService = matchedMeasurementService;
        _tubeWorkingPointService = tubeWorkingPointService;
        _productService = productService;
        _saleAdvertisementQueries = saleAdvertisementQueries;
        _manualFieldsExtractorService = manualFieldsExtractorService;
        _currenciesQueries = currenciesQueries;
        _lotsService = lotsService;
        _lotQueries = lotQueries;
    }

    public async Task<TubeWorkingPoint> GetTubeWorkingPointAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {
        var workingPoint = await _tubeWorkingPointService.GetWorkingPointInfo(productId, cancellationToken);

        return workingPoint == null
            ? throw NonOkHttpAnswerException.NotFound400()
            : workingPoint.ToApi();
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

    public async Task<ICollection<ProductWithId>> GetAllProductsAsync(CancellationToken cancellationToken)
    {
        var products = await _productService.GetAllProductsAsync(cancellationToken);

        return [.. products.Select(x => x.ToApi())];
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


    public async Task<ProductWithId> GetProductAsync(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var product = await _productService.GetProductAsync(id, cancellationToken);

        return product == null ? throw NonOkHttpAnswerException.NotFound400() : product.ToApi();
    }

    public async Task DeleteProductAsync(Guid id, CancellationToken cancellationToken) =>
        await _productService.DeleteProductAsync(id, cancellationToken);

    public async Task MarkProductAsCheckedAsync(
        Guid id,
        CancellationToken cancellationToken
    ) => await _productService.MarkProductAsCheckedAsync(id, cancellationToken);


    public Task<ICollection<SaleAdvertisement>> GetSaleAdvertisementsAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {
        return _saleAdvertisementQueries.GetSaleAdvertisementsAsync(productId, cancellationToken);
    }

    public Task<ICollection<LotInfoShort>> GetLotsAsync(
        Guid productId,
        CancellationToken cancellationToken
    )
    {
        return _lotQueries.GetLotsAsync(productId, cancellationToken);
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
            validationErrors.Add((key: nameof(lotInfo.ShippingAdditional), value: ["Not set"]));
        }
        
        if (lotInfo.Shipping == null)
        {
            validationErrors.Add((key: nameof(lotInfo.Shipping), value: ["Not set"]));
        }
        
        if (validationErrors.Count > 0)
        {
            throw NonOkHttpAnswerException.ValidationError400(validationErrors);
        }
        
        var maybeLot = Lot.Create(
            id: lotInfo.LotId,
            shippingAdditional: lotInfo.ShippingAdditional!.Value,
            shipping: lotInfo.Shipping!.Value,
            categories:  lotInfo.Categories.ToDictionary(x=>x.Type, x=> x.Value),
            titleChangeDate: DateTime.Parse(lotInfo.TitleChangeDate, CultureInfo.InvariantCulture).ToUniversalTime()
        );
        
        await maybeLot.Match<Task>(
            async lot => await _lotsService.UpsertLotInfoAsync(lot, cancellationToken),
            error => throw NonOkHttpAnswerException.ValidationError400(error.Message)
        );
        
        
        //todo закончил тут 
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

       
        
        
    }

    public Task<ICollection<long>> GetIgnoredLotsAsync(Guid productId, CancellationToken cancellationToken) =>
        _lotQueries.GetIgnoredLotsAsync(productId, cancellationToken);

    public async Task IgnoreLotsAsync(
        IEnumerable<long> ignoredLots,
        Guid productId,
        CancellationToken cancellationToken
    )
    {
        await _lotsService.IgnoreLotsAsync(
            ignoredLots,
            productId,
            cancellationToken
        );
    }

    public async Task<bool> GetIsLotIgnoredForProductAsync(
        Guid productId,
        long lotId,
        CancellationToken cancellationToken
    )
    {
        var lot = await _lotQueries.GetIsLotIgnoredForProductAsync(productId, lotId, cancellationToken);

        return lot;
    }

    public Task CalculatePricesForProductAsync(Guid productId, CancellationToken cancellationToken) =>
        _productService.CalculatePricesForProductAsync(productId, cancellationToken);

    public async Task<ICollection<MeasurementData>> GetMeasurementsAsync(
        MeasurementState? measurementState,
        Guid productId,
        CancellationToken cancellationToken)
    {
        var apiMeasurementState = measurementState.HasValue
            ? (MeasurementState)(int)measurementState.Value
            : (MeasurementState?)null;

        var measurementStates = apiMeasurementState.HasValue
            ? [apiMeasurementState.Value.ToApplication()]
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
                productState: x.MeasurementInfo.ProductState.ToApi(),
                location: x.MeasurementInfo.Location,
                matchId: x.MeasurementInfo.MatchId,
                lotId: x.MeasurementInfo.LotId,
                measurementState: x.MeasurementInfo.MeasurementState.ToApi(),
                similarMeasurements:
                [
                    .. x.SimilarMeasurements
                        .Select(similarMeasurement => new ApiSimilarMeasurementInfo(
                            measurementId: similarMeasurement.MeasurementId,
                            manufactureCode: similarMeasurement.ManufactureCode,
                            rmseSection1: similarMeasurement.RmseSection1,
                            rmseSection2: similarMeasurement.RmseSection2,
                            score: similarMeasurement.Score,
                            isCrossMatch: similarMeasurement.ComparisonMode == ComparisonMode.Cross,
                            sameDate: x.MeasurementInfo.ManufactureCode.Equals(
                                similarMeasurement.ManufactureCode,
                                StringComparison.OrdinalIgnoreCase),
                            isMatchedPair: similarMeasurement.IsMatchedPair,
                            matchId: similarMeasurement.MatchId,
                            doubleTriodeSectionRmse: similarMeasurement.DoubleTriodeSectionRmse
                        ))
                ]))
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
                productState: measurementData.ProductState.ToApplication(),
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

    public async Task<ICollection<string?>> GetLotIdsForProductAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {
        return
        [
            .. await _measurementService.GetLotIdsForProductAsync(
                productId: productId,
                cancellationToken: cancellationToken)
        ];
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
            state: state.ToApplication(),
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
        var lot = await _lotQueries.GetLotInfoAsync(
            lotId,
            cancellationToken
        );

        return lot == null ? throw NonOkHttpAnswerException.NotFound400() : lot.ToApiLot();
    }


    public async Task DeleteLotInfoAsync(long lotId, CancellationToken cancellationToken) =>
        await _lotsService.DeleteLotInfoAsync(lotId: lotId, cancellationToken: cancellationToken);

    public Task<ICollection<long>> GetLotIdsAsync(CancellationToken cancellationToken) =>
        _lotQueries.GetLotIdsAsync(cancellationToken);

    public Task<ICollection<LotState>> GetLotStatesAsync(
        IEnumerable<long> lotIds,
        CancellationToken cancellationToken
    )
    {
        return _lotQueries.GetLotStatesAsync(
            lotIds,
            cancellationToken
        );
    }

    public Task<ICollection<CategoryType>> GetCategoriesAsync(
        CancellationToken cancellationToken
    ) =>
        Task.FromResult((ICollection<CategoryType>)_manualFieldsExtractorService.GetCategories().Select(x=>x.ToApi()).ToList());

    public Task<ICollection<ShippingType>> GetShippingRatesAsync(
        CancellationToken cancellationToken
    ) => Task.FromResult<ICollection<ShippingType>>(_shippingRatesService.ShippingRates.Select(x=>x.ToApi()).ToList());

    public async Task<ICollection<Currency>> GetCurrenciesAsync(
        CancellationToken cancellationToken
    )
    {
        var currencies = await _currenciesQueries.GetCurrenciesAsync(cancellationToken);
        return currencies.Select(x => x.ToApi()).ToList();

    }


    public Task<ICollection<ExtractedFields>> ExtractDataAsync(
        Server.Controllers.Generated.LotDataToExtract lotInfo,
        CancellationToken cancellationToken)
    {
        return Task.FromResult(
            _manualFieldsExtractorService.ExtractManualData(lotInfo.ToApplication()).ToApi()
        );
    }

    public async Task CalculatePricesForAllAsync(CancellationToken cancellationToken) =>
        await _productService.CalculatePricesForAllAsync(cancellationToken);
}