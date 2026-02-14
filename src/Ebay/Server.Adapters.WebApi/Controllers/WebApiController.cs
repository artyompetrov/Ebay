using Microsoft.AspNetCore.Mvc;
using Server.Adapters.WebApi.Generated;

namespace Server.Adapters.WebApi.Controllers;

public sealed class WebApiController : WebApiControllerBase
{
    public override Task<ActionResult<PingResponse>> GetPing(CancellationToken cancellationToken = default)
    {
        var response = new PingResponse("pong");
        return Task.FromResult<ActionResult<PingResponse>>(Ok(response));
    }
}
