using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Adapters.Driving.WebApi.Generated;
using Server.Application.New;
using DomainMeasurementState = Server.Domain.Measurements.MeasurementState;
using DomainProductState = Server.Domain.Measurements.ProductState;

namespace Server.Adapters.Driving.WebApi.Controllers;

[Authorize]
public sealed class WebApiController : WebApiControllerBase
{
    private readonly LotForSaleService _lotForSaleService;
    private readonly MeasurementPhotoService _measurementPhotoService;
    private readonly IMeasurementPhotoQueries _measurementPhotoQueries;

    public WebApiController(
        LotForSaleService lotForSaleService,
        MeasurementPhotoService measurementPhotoService,
        IMeasurementPhotoQueries measurementPhotoQueries)
    {
        _lotForSaleService = lotForSaleService;
        _measurementPhotoService = measurementPhotoService;
        _measurementPhotoQueries = measurementPhotoQueries;
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
        var photo = await _measurementPhotoQueries.Get(measurementId, photoId, cancellationToken);
        if (photo == null)
        {
            return NotFound();
        }

        return File(photo.Content, photo.ContentType, photo.FileName);
    }

    public override async Task<ActionResult<ICollection<MeasurementPhotoCountResponse>>> GetMeasurementPhotoCounts(
        IEnumerable<string> measurementIds,
        CancellationToken cancellationToken = default)
    {
        var metadata = await _measurementPhotoQueries.GetMetadataByMeasurementIds(measurementIds.ToList(), cancellationToken);

        var response = metadata
            .GroupBy(x => x.MeasurementId)
            .Select(x => new MeasurementPhotoCountResponse(x.Key, x.Count()))
            .ToList();

        return response;
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
