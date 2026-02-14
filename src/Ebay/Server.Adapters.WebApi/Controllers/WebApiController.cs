using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Adapters.WebApi.Generated;
using Server.Application.Abstractions.Queries;

namespace Server.Adapters.WebApi.Controllers;

[Authorize]
public sealed class WebApiController : WebApiControllerBase
{
    private readonly ISaleLotQueries _saleLotQueries;

    public WebApiController(ISaleLotQueries saleLotQueries)
    {
        _saleLotQueries = saleLotQueries;
    }

    public override Task<ActionResult<PingResponse>> GetPing(CancellationToken cancellationToken = default)
    {
        var response = new PingResponse("pong");
        return Task.FromResult<ActionResult<PingResponse>>(Ok(response));
    }

    public override async Task<ActionResult<SaleLotResponse>> GetSaleLotById(string id, CancellationToken cancellationToken = default)
    {
        var lot = await _saleLotQueries.GetByIdAsync(id, cancellationToken);

        if (lot is null)
        {
            return NotFound();
        }

        return Ok(new SaleLotResponse(lot.Id, lot.Name));
    }
}
