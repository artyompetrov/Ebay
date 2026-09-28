using System.Globalization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Adapters.Driving.WebApi.Generated;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Application.New;
using Server.Application.New.LotDataExtractor;
using Server.Application.New.MatchedPairs;
using Server.Application.New.TubeWorkingPoints;
using Server.Domain;
using Server.Domain.Exceptions;
using Server.Domain.LotDataExtraction;
using Server.Domain.Measurements;
using Server.Domain.Product;
using Server.Domain.Shipping;
using ApiSimilarMeasurementInfo = Server.Adapters.Driving.WebApi.Generated.SimilarMeasurementInfo;
using Currency = Server.Adapters.Driving.WebApi.Generated.Currency;
using DomainMeasurementState = Server.Domain.Measurements.MeasurementState;
using DomainProductState = Server.Domain.Measurements.ProductState;
using MeasurementState = Server.Adapters.Driving.WebApi.Generated.MeasurementState;
using TubeWorkingPoint = Server.Adapters.Driving.WebApi.Generated.TubeWorkingPoint;

namespace Server.Adapters.Driving.WebApi.Controllers;

[Authorize]
public sealed class WebApiController : WebApiControllerBase
{
    private readonly LotForSaleService _lotForSaleService;
    private readonly MeasurementPhotoService _measurementPhotoService;
    private readonly IMeasurementPhotoQueries _measurementPhotoQueries;
    private readonly IMeasurementService _measurementService;
    private readonly MatchedMeasurementService _matchedMeasurementService;
    private readonly TubeWorkingPointService _tubeWorkingPointService;
    private readonly ProductService _productService;
    private readonly LotService _lotService;
    private readonly ILotQueries _lotQueries;
    private readonly ICurrencyQueries _currencyQueries;
    private readonly IProductEmailSendHistoryQueries _productEmailSendHistoryQueries;
    private readonly ProductPassportService _productPassportService;
    private readonly IPassportQueries _passportQueries;
    private readonly IgnoredLotService _ignoredLotService;
    private readonly IIgnoredLotQueries _ignoredLotQueries;
    private readonly ClientErrorService _clientErrorService;

    public WebApiController(
        LotForSaleService lotForSaleService,
        MeasurementPhotoService measurementPhotoService,
        IMeasurementPhotoQueries measurementPhotoQueries,
        IMeasurementService measurementService,
        MatchedMeasurementService matchedMeasurementService,
        TubeWorkingPointService tubeWorkingPointService,
        ProductService productService,
        LotService lotService,
        ILotQueries lotQueries,
        ICurrencyQueries currencyQueries,
        IProductEmailSendHistoryQueries productEmailSendHistoryQueries,
        ProductPassportService productPassportService,
        IPassportQueries passportQueries,
        IgnoredLotService ignoredLotService,
        IIgnoredLotQueries ignoredLotQueries,
        ClientErrorService clientErrorService)
    {
        _lotForSaleService = lotForSaleService;
        _measurementPhotoService = measurementPhotoService;
        _measurementPhotoQueries = measurementPhotoQueries;
        _measurementService = measurementService;
        _matchedMeasurementService = matchedMeasurementService;
        _tubeWorkingPointService = tubeWorkingPointService;
        _productService = productService;
        _lotService = lotService;
        _lotQueries = lotQueries;
        _currencyQueries = currencyQueries;
        _productEmailSendHistoryQueries = productEmailSendHistoryQueries;
        _productPassportService = productPassportService;
        _passportQueries = passportQueries;
        _ignoredLotService = ignoredLotService;
        _ignoredLotQueries = ignoredLotQueries;
        _clientErrorService = clientErrorService;
    }

    public override async Task<IActionResult> CreateLotForSale(LotForSaleCreateRequest body, CancellationToken cancellationToken = default)
    {
        await _lotForSaleService.CreateLotForSaleAsync(
            body.Name,
            body.ProductId,
            ToDomainProductState(body.ProductState),
            ToDomainMeasurementState(body.MeasurementState),
            cancellationToken);
        return Ok();
    }

    public override async Task<IActionResult> DeleteLotForSale(string lotId, CancellationToken cancellationToken = default)
    {
        await _lotForSaleService.DeleteLotForSaleAsync(lotId, cancellationToken);
        return Ok();
    }

    public override async Task<ActionResult<ICollection<LotForSaleResponse>>> GetLotForSales(CancellationToken cancellationToken = default)
    {
        var lotForSales = await _lotForSaleService.GetLotForSalesAsync(cancellationToken);

        var response = lotForSales
            .Select(x => new LotForSaleResponse(x.Id, ToApiMeasurementState(x.MeasurementState), x.Name, x.ProductId, ToApiProductState(x.ProductState)))
            .ToList();

        return response;
    }

    public override async Task<ActionResult<string>> GetLotForSaleDescription(string lotId, CancellationToken cancellationToken = default)
    {
        var lotForSale = await _lotForSaleService.GetLotForSaleByIdAsync(lotId, cancellationToken);
        if (lotForSale == null)
        {
            return NotFound();
        }

        var descriptionUrl =
            $"/ebay_description/{lotForSale.ProductId}?measurementState={lotForSale.MeasurementState:G}&state={lotForSale.ProductState:G}&lotId={Uri.EscapeDataString(lotForSale.Id)}";

        return LocalRedirect(descriptionUrl);
    }

    public override async Task<ActionResult<ICollection<MeasurementPhotoResponse>>> GetMeasurementPhotos(
        string measurementId,
        CancellationToken cancellationToken = default)
    {
        var photos = await _measurementPhotoQueries.GetByMeasurementId(measurementId, cancellationToken);
        var response = photos
            .Select(x => new MeasurementPhotoResponse(x.FileName, x.Id, x.Order))
            .ToList();
        return response;
    }

    public override async Task<IActionResult> UploadMeasurementPhoto(
        string measurementId,
        MeasurementPhotoUploadRequest body,
        CancellationToken cancellationToken = default)
    {
        var isUploaded = await _measurementPhotoService.UploadAsync(
            measurementId: measurementId,
            fileName: body.FileName,
            contentType: body.ContentType,
            content: body.File,
            order: body.Order,
            cancellationToken: cancellationToken);

        if (!isUploaded)
        {
            return NotFound();
        }

        return Ok();
    }

    public override async Task<IActionResult> DeleteMeasurementPhoto(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken = default)
    {
        var isDeleted = await _measurementPhotoService.DeleteAsync(
            measurementId: measurementId,
            photoId: photoId,
            cancellationToken: cancellationToken);

        if (!isDeleted)
        {
            return NotFound();
        }

        return Ok();
    }

    // Anonymous: embedded as <img> src on EbayLotDescriptionPage, which is pulled into public eBay listing descriptions.
    [AllowAnonymous]
    public override async Task<IActionResult> GetMeasurementPhotoContent(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken = default)
    {
        var content = await _measurementPhotoService.GetContentAsync(measurementId, photoId, cancellationToken);
        if (content == null)
        {
            return NotFound();
        }

        return File(content.Content, content.ContentType);
    }

    // Anonymous: embedded as <img> src on EbayLotDescriptionPage, which is pulled into public eBay listing descriptions.
    [AllowAnonymous]
    public override async Task<IActionResult> GetMeasurementPhotoThumbnailContent(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken = default)
    {
        var thumbnail = await _measurementPhotoService.GetThumbnailContentAsync(measurementId, photoId, cancellationToken);
        if (thumbnail == null)
        {
            return NotFound();
        }

        return File(thumbnail.Content, thumbnail.ContentType);
    }

    public override async Task<ActionResult<ICollection<MeasurementPhotoCountResponse>>> GetMeasurementPhotoCounts(
        IEnumerable<string> measurementIds,
        CancellationToken cancellationToken = default)
    {
        var metadata = await _measurementPhotoQueries.GetMetadataByMeasurementIds([.. measurementIds], cancellationToken);

        var response = metadata
            .GroupBy(x => x.MeasurementId)
            .Select(x => new MeasurementPhotoCountResponse(x.Key, x.Count()))
            .ToList();

        return response;
    }

    public override async Task<ActionResult<ICollection<ProductPassportInfo>>> GetProductPassports(
        Guid productId,
        CancellationToken cancellationToken = default)
    {
        var passports = await _passportQueries.GetPassports(productId, cancellationToken);

        return (List<ProductPassportInfo>)[.. passports.Select(x => new ProductPassportInfo(x.FileName, x.Id, x.Order))];
    }

    public override async Task<IActionResult> UploadProductPassport(
        ProductPassportUpload body,
        Guid productId,
        CancellationToken cancellationToken = default)
    {
        await _productPassportService.UploadAsync(
            productId: productId,
            fileName: body.FileName,
            contentType: body.ContentType,
            order: body.Order,
            content: body.File,
            cancellationToken: cancellationToken);

        return Ok();
    }

    public override async Task<IActionResult> DeleteProductPassport(
        Guid productId,
        Guid passportId,
        CancellationToken cancellationToken = default)
    {
        if (!await _productPassportService.DeleteAsync(productId, passportId, cancellationToken))
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        return Ok();
    }

    public override async Task<ActionResult<TubeWorkingPoint>> GetTubeWorkingPoint(
        Guid productId,
        CancellationToken cancellationToken = default)
    {
        var workingPoint = await _tubeWorkingPointService.GetWorkingPointInfo(productId, cancellationToken);

        return workingPoint == null ? throw NonOkHttpAnswerException.NotFound400() : workingPoint.ToApiTubeWorkingPoint();
    }

    public override async Task<IActionResult> UpsertTubeWorkingPoint(
        TubeWorkingPoint body,
        Guid productId,
        CancellationToken cancellationToken = default)
    {
        bool productFound;
        try
        {
            productFound = await _tubeWorkingPointService.CreateTubeWorkingPoint(
                tubeProductId: productId,
                anodeVoltage: body.AnodeVoltage,
                gridVoltage: body.GridVoltage,
                anodeVoltageHalfWidth: body.AnodeVoltageHalfWidth,
                gridVoltageHalfWidth: body.GridVoltageHalfWidth,
                nominalCurrent: body.NominalCurrent,
                cancellationToken: cancellationToken);
        }
        catch (DomainException ex)
        {
            throw NonOkHttpAnswerException.ValidationError400(nameof(body), errors: [ex.Message]);
        }

        if (!productFound)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        return Ok();
    }

    public override async Task<IActionResult> UpdateProductPassport(
        ProductPassportUpdate body,
        Guid productId,
        Guid passportId,
        CancellationToken cancellationToken = default)
    {
        if (!await _productPassportService.UpdateOrderAsync(productId, passportId, body.Order, cancellationToken))
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        return Ok();
    }

    public override async Task<ActionResult<ICollection<ProductWithId>>> GetAllProducts(CancellationToken cancellationToken = default)
    {
        var products = await _productService.GetAllProductsAsync(cancellationToken);

        return (List<ProductWithId>)[.. products.Select(x => x.ToApiProduct())];
    }

    public override async Task<ActionResult<Guid>> CreateProduct(
        ProductWithoutId body,
        CancellationToken cancellationToken = default)
    {
        return (await _productService.CreateProductAsync(
            name: body.Name,
            weight: body.Weight,
            searchQueries: [.. body.SearchQueries.Select(x => x.Query)],
            ruSearchQueries: [.. body.RuSearchQueries.Select(x => x.Query)],
            description: body.Description,
            cancellationToken: cancellationToken)).Id;
    }

    public override async Task<IActionResult> UpdateProduct(
        ProductWithoutId body,
        Guid id,
        CancellationToken cancellationToken = default)
    {
        await _productService.UpdateProductAsync(
            productId: id,
            name: body.Name,
            weight: body.Weight,
            searchQueries: [.. body.SearchQueries.Select(x => new SearchQueryWithId(x.Id, x.Query))],
            ruSearchQueries: [.. body.RuSearchQueries.Select(x => new SearchQueryWithId(x.Id, x.Query))],
            description: body.Description,
            cancellationToken: cancellationToken);

        return Ok();
    }

    public override async Task<ActionResult<ProductWithId>> GetProduct(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var product = await _productService.GetProductAsync(id, cancellationToken);

        return product == null ? throw NonOkHttpAnswerException.NotFound400() : product.ToApiProduct();
    }

    public override async Task<IActionResult> DeleteProduct(Guid id, CancellationToken cancellationToken = default)
    {
        await _productService.DeleteProductAsync(id, cancellationToken);
        return Ok();
    }

    public override async Task<IActionResult> MarkProductAsChecked(Guid id, CancellationToken cancellationToken = default)
    {
        await _productService.MarkProductAsCheckedAsync(id, cancellationToken);
        return Ok();
    }

    public override async Task<ActionResult<ICollection<SaleAdvertisement>>> GetSaleAdvertisements(
        Guid productId,
        CancellationToken cancellationToken = default)
    {
        var product = await _productService.GetProductAsync(productId, cancellationToken);

        if (product == null)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        var ads = await _productEmailSendHistoryQueries.GetForProductAsync(productId, cancellationToken);

        return (List<SaleAdvertisement>)[.. ads
            .Select(x => new SaleAdvertisement(
                createdAt: x.AdvertisementDate,
                isAmbiguous: x.IsAmbiguous,
                link: x.Link,
                marketplace: x.Marketplace,
                seller: x.Seller,
                contact: x.Contact))];
    }

    public override async Task<ActionResult<ICollection<LotInfoShort>>> GetLots(
        Guid productId,
        CancellationToken cancellationToken = default)
    {
        var product = await _productService.GetProductAsync(productId, cancellationToken);

        if (product == null)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        var lots = await _lotQueries.GetLotsForProductAsync(productId, cancellationToken);

        return (List<LotInfoShort>)[.. lots.Select(x => x.ToApiLotInfoShort())];
    }

    public override async Task<IActionResult> UpsertLotInfo(
        LotInfo body,
        Guid productId,
        CancellationToken cancellationToken = default)
    {
        var validationErrors = new List<(string key, string[] value)>();
        if (body.ShippingAdditional == null)
        {
            validationErrors.Add((key: nameof(body.ShippingAdditional), value: ["Not set"]));
        }

        if (body.Shipping == null)
        {
            validationErrors.Add((key: nameof(body.Shipping), value: ["Not set"]));
        }

        if (!new HashSet<string> { LotCategories.Conditions.CategoryName, LotCategories.TestState.CategoryName }.SequenceEqual(
                body.Categories.Select(x => x.Type)
            ))
        {
            validationErrors.Add((key: nameof(body.Categories), value: ["Not all categories set"]));
        }

        if (validationErrors.Count > 0)
        {
            throw NonOkHttpAnswerException.ValidationError400(validationErrors);
        }

        var categories = body.Categories.ToDictionary(x => x.Type, x => x.Value);
        var titleChangedDate = DateTimeOffset.Parse(body.TitleChangeDate, CultureInfo.InvariantCulture).ToUniversalTime();
        var updateDate = DateTimeOffset.UtcNow;
        var purchaseHistory = body.PurchaseHistory
            .Select(purchase => (
                Date: DateTimeOffset.Parse(purchase.Date, CultureInfo.InvariantCulture).ToUniversalTime(),
                Price: purchase.Price,
                Quantity: purchase.Quantity))
            .ToList();

        await _lotService.UpsertLotInfoAsync(
            lotId: body.LotId,
            productId: productId,
            name: body.Name,
            pcs: body.Pcs,
            lotSize: body.LotSize,
            currencyId: body.Currency,
            shippingCountry: body.ShippingCountry,
            price: body.Price,
            shipping: body.Shipping!.Value,
            shippingAdditional: body.ShippingAdditional!.Value,
            description: body.Description,
            shortDescription: body.ShortDescription,
            condition: body.Condition,
            conditionDescription: body.ConditionDescription,
            seller: body.Seller,
            locatedIn: body.LocatedIn,
            titleChangeDate: titleChangedDate,
            updateDate: updateDate,
            categories: categories,
            purchaseHistory: purchaseHistory,
            cancellationToken: cancellationToken);

        return Ok();
    }

    public override async Task<ActionResult<ICollection<long>>> GetIgnoredLots(Guid productId, CancellationToken cancellationToken = default) =>
        (List<long>)[.. await _ignoredLotQueries.GetIgnoredLotIdsAsync(productId, cancellationToken)];

    public override async Task<IActionResult> IgnoreLots(
        IEnumerable<long> body,
        Guid productId,
        CancellationToken cancellationToken = default)
    {
        await _ignoredLotService.IgnoreLotsAsync(productId, body.ToHashSet(), cancellationToken);
        return Ok();
    }

    public override async Task<ActionResult<bool>> GetIsLotIgnoredForProduct(
        Guid productId,
        long lotId,
        CancellationToken cancellationToken = default) =>
        await _ignoredLotQueries.IsLotIgnoredAsync(productId, lotId, cancellationToken);

    public override async Task<IActionResult> CalculatePricesForProduct(Guid productId, CancellationToken cancellationToken = default)
    {
        await _productService.CalculatePricesForProductAsync(productId, cancellationToken);
        return Ok();
    }

    public override async Task<ActionResult<ICollection<MeasurementData>>> GetMeasurements(
        MeasurementState? measurementState,
        Guid productId,
        CancellationToken cancellationToken = default)
    {
        var measurementStates = measurementState.HasValue
            ? new[] { measurementState.Value.ToDbMeasurementState() }
            : Enum.GetValues<DomainMeasurementState>();

        var productStates = Enum.GetValues<DomainProductState>();

        var measurements = await _measurementService.GetMeasurementInfos(
            productId: productId,
            productState: productStates,
            measurementStates: measurementStates,
            cancellationToken: cancellationToken);

        var result = measurements
            .Select(x => new MeasurementData(
                doubleTriodeSectionRmse: x.Data.DoubleTriodeSectionRmse,
                manufactureCode: x.Data.MeasurementInfo.ManufactureCode,
                measurementId: x.Data.MeasurementInfo.Id,
                isPublishedOnEbay: x.IsPublishedOnEbay,
                productState: x.Data.MeasurementInfo.ProductState.ToApiProductState(),
                location: x.Data.MeasurementInfo.Location,
                matchId: x.Data.MeasurementInfo.MatchId,
                lotId: x.Data.MeasurementInfo.LotId,
                measurementState: x.Data.MeasurementInfo.MeasurementState.ToApiMeasurementState(),
                similarMeasurements: [.. x.Data.SimilarMeasurements
                    .Select(similarMeasurement => new ApiSimilarMeasurementInfo(
                        measurementId: similarMeasurement.MeasurementId,
                        manufactureCode: similarMeasurement.ManufactureCode,
                        rmseSection1: similarMeasurement.RmseSection1,
                        rmseSection2: similarMeasurement.RmseSection2,
                        score: similarMeasurement.Score,
                        isCrossMatch: similarMeasurement.ComparisonMode == ComparisonMode.Cross,
                        sameDate: x.Data.MeasurementInfo.ManufactureCode.Equals(similarMeasurement.ManufactureCode, StringComparison.OrdinalIgnoreCase),
                        isMatchedPair: similarMeasurement.IsMatchedPair,
                        matchId: similarMeasurement.MatchId,
                        doubleTriodeSectionRmse: similarMeasurement.DoubleTriodeSectionRmse
                    ))],
                createdAt: x.Data.MeasurementInfo.CreatedAt))
            .ToList();

        return result;
    }

    public override async Task<IActionResult> UploadMeasurement(
        MeasurementDataToUpload body,
        Guid productId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await _measurementService.SaveMeasurement(
                measurementId: body.MeasurementId,
                measurementsFile: body.File,
                productState: body.ProductState.ToDbProductState(),
                manufactureCode: body.ManufactureCode,
                productId: productId,
                cancellationToken: cancellationToken);
        }
        catch (MeasurementException measurementException)
        {
            throw NonOkHttpAnswerException.ValidationError400(
                field: nameof(body),
                measurementException.Message);
        }

        return Ok();
    }

    public override async Task<ActionResult<ICollection<string?>>> GetLotIdsForProduct(Guid productId, CancellationToken cancellationToken = default) =>
        (List<string?>)[.. await _measurementService.GetLotIdsForProductAsync(
            productId: productId,
            cancellationToken: cancellationToken)];

    public override async Task<IActionResult> DeleteMeasurement(
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken = default)
    {
        await _measurementService.DeleteMeasurement(
            measurementId: measurementId,
            cancellationToken: cancellationToken);

        return Ok();
    }

    public override async Task<IActionResult> UpdateMeasurementLocation(
        string body,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken = default)
    {
        await _measurementService.UpdateMeasurementLocation(
            location: body,
            measurementId: measurementId,
            cancellationToken: cancellationToken);

        return Ok();
    }

    public override async Task<IActionResult> UpdateMeasurementManufactureCode(
        string body,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken = default)
    {
        await _measurementService.UpdateMeasurementManufactureCode(
            manufactureCode: body,
            measurementId: measurementId,
            cancellationToken: cancellationToken);

        return Ok();
    }

    public override async Task<IActionResult> UpdateMeasurementMatchId(
        string body,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken = default)
    {
        await _measurementService.UpdateMeasurementMatchId(
            matchId: body,
            measurementId: measurementId,
            cancellationToken: cancellationToken);

        return Ok();
    }

    public override async Task<IActionResult> UpdateMeasurementLotId(
        string? body,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken = default)
    {
        await _measurementService.UpdateMeasurementLotId(
            lotId: body,
            measurementId: measurementId,
            cancellationToken: cancellationToken);

        return Ok();
    }

    public override async Task<IActionResult> UpdateMeasurementState(
        MeasurementState body,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken = default)
    {
        await _measurementService.UpdateMeasurementState(
            state: body.ToDbMeasurementState(),
            measurementId: measurementId,
            cancellationToken: cancellationToken);

        return Ok();
    }

    public override async Task<IActionResult> FindMatchedMeasurements(
        Guid productId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await _matchedMeasurementService.FindMatchedMeasurementsAsync(
                productId: productId,
                cancellationToken: cancellationToken);
        }
        catch (DomainException ex)
        {
            throw NonOkHttpAnswerException.ValidationError400(
                field: "tubeWorkingPoint",
                errors: ex.Message);
        }

        return Ok();
    }

    public override async Task<ActionResult<LotInfoWithProductId>> GetLotInfo(
        long lotId,
        CancellationToken cancellationToken = default)
    {
        var lot = await _lotQueries.GetLotAsync(lotId, cancellationToken);

        return lot == null ? throw NonOkHttpAnswerException.NotFound400() : lot.ToApiLot();
    }

    public override async Task<IActionResult> DeleteLotInfo(long lotId, CancellationToken cancellationToken = default)
    {
        await _lotService.DeleteLotInfoAsync(lotId, cancellationToken);
        return Ok();
    }

    public override async Task<ActionResult<ICollection<long>>> GetLotIds(CancellationToken cancellationToken = default) =>
        (List<long>)[.. await _lotQueries.GetAllLotIdsAsync(cancellationToken)];

    public override async Task<ActionResult<ICollection<LotState>>> GetLotStates(
        IEnumerable<long> body,
        CancellationToken cancellationToken = default)
    {
        var idsToSelect = body.ToHashSet();
        var result = await _lotQueries.GetLotUpdateInfoAsync(idsToSelect, cancellationToken);

        return (List<LotState>)[.. result.Select(
                x => new LotState(
                    lastUpdate: x.UpdateDate.ToString(WellKnown.Formats.TimeFormat, CultureInfo.InvariantCulture),
                    lotId: x.Id
                )
            )];
    }

    public override Task<ActionResult<ICollection<CategoryType>>> GetCategories(CancellationToken cancellationToken = default)
    {
        return Task.FromResult<ActionResult<ICollection<CategoryType>>>(
            (List<CategoryType>)
            [
                new(
                    items:
                    [
                        new(description: "NEW", id: LotCategories.Conditions.New),
                        new(description: "USED", id: LotCategories.Conditions.Used),
                        new(description: "NOT WORKING", id: LotCategories.Conditions.NotWorking)
                    ],
                    type: "condition"
                ),

                new(
                    items:
                    [
                        new(description: "Not tested", id: LotCategories.TestState.NotTested),
                        new(description: "Tested", id: LotCategories.TestState.Tested),
                        new(description: "Mathced", id: LotCategories.TestState.Matched)
                    ],
                    type: "test_state"
                )
            ]);
    }

    public override Task<ActionResult<ICollection<ShippingType>>> GetShippingRates(CancellationToken cancellationToken = default) =>
        Task.FromResult<ActionResult<ICollection<ShippingType>>>(
            (List<ShippingType>)[.. ShippingRatesTable.ShippingRates.Select(x => x.ToApiShippingType())]);

    public override async Task<ActionResult<ICollection<Currency>>> GetCurrencies(CancellationToken cancellationToken = default)
    {
        return (List<Currency>)[.. (await _currencyQueries.GetAllCurrenciesAsync(cancellationToken)).Select(x => x.ToApiCurrency())];
    }

    public override Task<ActionResult<ICollection<ExtractedFields>>> ExtractData(
        LotDataToExtract body,
        CancellationToken cancellationToken = default)
    {
        var lotTextFields = new LotTextFields(
            Name: body.Name,
            Condition: body.Condition,
            DescriptionText: body.DescriptionText,
            ConditionDescription: body.ConditionDescription,
            ShortDescription: body.ShortDescription,
            LotSize: body.LotSize
        );

        return Task.FromResult<ActionResult<ICollection<ExtractedFields>>>(
            ManualFieldsExtractor.ExtractManualData(lotTextFields).ToApiExtractedData().ToList());
    }

    public override async Task<IActionResult> SaveError(ClientErrorInfo body, CancellationToken cancellationToken = default)
    {
        await _clientErrorService.SaveErrorAsync(body.Url, body.Error, cancellationToken);
        return Ok();
    }

    public override async Task<IActionResult> CalculatePricesForAll(CancellationToken cancellationToken = default)
    {
        await _lotService.CalculatePricesForAllAsync(cancellationToken);
        return Ok();
    }

    private static DomainProductState ToDomainProductState(LotForSaleProductState productState)
    {
        return productState switch
        {
            LotForSaleProductState.New => DomainProductState.New,
            LotForSaleProductState.Used => DomainProductState.Used,
            _ => throw new ArgumentOutOfRangeException(nameof(productState), productState, null)
        };
    }

    private static DomainMeasurementState ToDomainMeasurementState(LotForSaleMeasurementState measurementState)
    {
        return measurementState switch
        {
            LotForSaleMeasurementState.Created => DomainMeasurementState.Created,
            LotForSaleMeasurementState.Selling => DomainMeasurementState.Selling,
            _ => throw new ArgumentOutOfRangeException(nameof(measurementState), measurementState, null)
        };
    }

    private static LotForSaleMeasurementState ToApiMeasurementState(DomainMeasurementState measurementState)
    {
        return measurementState switch
        {
            DomainMeasurementState.Created => LotForSaleMeasurementState.Created,
            DomainMeasurementState.Selling => LotForSaleMeasurementState.Selling,
            DomainMeasurementState.Sold => throw new NotImplementedException(),
            _ => throw new ArgumentOutOfRangeException(nameof(measurementState), measurementState, null)
        };
    }
    private static LotForSaleProductState ToApiProductState(DomainProductState productState)
    {
        return productState switch
        {
            DomainProductState.New => LotForSaleProductState.New,
            DomainProductState.Used => LotForSaleProductState.Used,
            _ => throw new ArgumentOutOfRangeException(nameof(productState), productState, null)
        };
    }
}
