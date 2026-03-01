using Microsoft.AspNetCore.Mvc;
using Server.Adapters.Driving.WebApi.Generated;
using Server.Application.New;
using DomainMeasurementState = Server.Domain.Measurements.MeasurementState;
using DomainProductState = Server.Domain.Measurements.ProductState;

namespace Server.Adapters.Driving.WebApi.Controllers;

public sealed class WebApiController : WebApiControllerBase
{
    private readonly LotForSaleService _lotForSaleService;

    public WebApiController(LotForSaleService lotForSaleService)
    {
        _lotForSaleService = lotForSaleService;
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