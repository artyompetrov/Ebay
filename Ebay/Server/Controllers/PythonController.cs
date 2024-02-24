using Microsoft.AspNetCore.Authorization;

namespace Ebay.Server.Controllers;

public class PythonController : Microsoft.AspNetCore.Mvc.Controller
{
    private readonly IHttpClientFactory _httpClientFactory;

    public PythonController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [Microsoft.AspNetCore.Mvc.HttpGet, Microsoft.AspNetCore.Mvc.Route("python")]
    public async Task<string> GetAllProducts(CancellationToken cancellationToken)
    {
        var client = _httpClientFactory.CreateClient(WellKnown.Python.ClientName);

        var response = await client.GetAsync("/");
        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();

        }
        else
        {
            throw NonOkHttpAnswerException.NotAvailable503();
        }

    }
}