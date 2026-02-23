using Microsoft.AspNetCore.Mvc;
using Server.Adapters.Driving.WebApi.Generated;
using Server.Application.New;
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
        await _lotForSaleService.CreateLotForSaleAsync(body.Name, body.ProductId, ToDomainProductState(body.ProductState), cancellationToken);
        return Ok();
    }

    public override async Task<ActionResult<ICollection<LotForSaleResponse>>> GetLotForSales(CancellationToken cancellationToken = default)
    {
        var lotForSales = await _lotForSaleService.GetLotForSalesAsync(cancellationToken);

        var response = lotForSales
            .Select(x => new LotForSaleResponse(x.Id, x.Name, x.ProductId, ToApiProductState(x.ProductState)))
            .ToList();

        return response;
    }

    private static DomainProductState ToDomainProductState(Generated.LotForSaleProductState productState)
    {
        return productState switch
        {
            Generated.LotForSaleProductState.New => DomainProductState.New,
            Generated.LotForSaleProductState.Used => DomainProductState.Used,
            _ => throw new ArgumentOutOfRangeException(nameof(productState), productState, null)
        };
    }

    private static Generated.LotForSaleProductState ToApiProductState(DomainProductState productState)
    {
        return productState switch
        {
            DomainProductState.New => Generated.LotForSaleProductState.New,
            DomainProductState.Used => Generated.LotForSaleProductState.Used,
            _ => throw new ArgumentOutOfRangeException(nameof(productState), productState, null)
        };
    }
}
