using Microsoft.AspNetCore.Mvc;
using Server.Adapters.Driving.WebApi.Generated;
using Server.Application.New;

namespace Server.Adapters.Driving.WebApi.Controllers;

public sealed class WebApiController : WebApiControllerBase
{
    private readonly LotForSaleService _lotForSaleService;

    public WebApiController(LotForSaleService lotForSaleService)
    {
        _lotForSaleService = lotForSaleService;
    }

    public override Task<ActionResult<PingResponse>> GetPing(CancellationToken cancellationToken = default)
    {
        var response = new PingResponse("pong");
        return Task.FromResult<ActionResult<PingResponse>>(Ok(response));
    }

    public override async Task<ActionResult<ICollection<LotForSaleResponse>>> GetLotForSales(CancellationToken cancellationToken = default)
    {
        var lotForSales = await _lotForSaleService.GetLotForSalesAsync(cancellationToken);

        var response = lotForSales
            .Select(x => new LotForSaleResponse(x.Id, x.Name))
            .ToList();

        return response;
    }
}
