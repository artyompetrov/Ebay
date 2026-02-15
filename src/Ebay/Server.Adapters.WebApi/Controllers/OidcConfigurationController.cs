using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Mvc;

namespace Server.Adapters.WebApi.Controllers;

public class OidcConfigurationController : Controller
{
    public OidcConfigurationController(
        IClientRequestParametersProvider clientRequestParametersProvider)
    {
        ClientRequestParametersProvider = clientRequestParametersProvider;
    }

    public IClientRequestParametersProvider ClientRequestParametersProvider { get; }

    [HttpGet("_configuration/{clientId}")]
    public IActionResult GetClientRequestParameters([FromRoute] string clientId)
    {
        var parameters = ClientRequestParametersProvider.GetClientParameters(context: HttpContext, clientId: clientId);
        return Ok(parameters);
    }
}