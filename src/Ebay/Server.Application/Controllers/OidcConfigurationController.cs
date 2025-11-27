using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Server.Application.Controllers;

#pragma warning disable CS1591
public class OidcConfigurationController(
    IClientRequestParametersProvider clientRequestParametersProvider,
    ILogger<OidcConfigurationController> logger) : Controller
{
    private readonly ILogger<OidcConfigurationController> _logger = logger;

    public IClientRequestParametersProvider ClientRequestParametersProvider { get; } = clientRequestParametersProvider;

    [HttpGet("_configuration/{clientId}")]
    public IActionResult GetClientRequestParameters([FromRoute] string clientId)
    {
        var parameters = ClientRequestParametersProvider.GetClientParameters(context: HttpContext, clientId: clientId);
        return Ok(parameters);
    }
}

#pragma warning restore CS1591