using Microsoft.AspNetCore.Mvc;
using Server.Adapters.Driving.WebApi.Generated;

namespace Server.Adapters.Driving.WebApi.Controllers;

public sealed class WebApiController : WebApiControllerBase
{
    public override Task<ActionResult<PingResponse>> GetPing(CancellationToken cancellationToken = default)
    {
        var response = new PingResponse("pong");
        return Task.FromResult<ActionResult<PingResponse>>(Ok(response));
    }
}