using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Server.Adapters.WebApi.Controllers;

namespace Server.Adapters.WebApi;

public static class ServiceCollectionExtensions
{
    public static void AddWebApiAdapter(
        this IServiceCollection services)
    {
        _ = services.AddControllers().AddApplicationPart(typeof(WebApiController).Assembly);
        services.TryAddTransient<IClientRequestParametersProvider, FallbackClientRequestParametersProvider>();
    }

    private sealed class FallbackClientRequestParametersProvider : IClientRequestParametersProvider
    {
        public IDictionary<string, string> GetClientParameters(
            HttpContext context,
            string clientId)
        {
            return new Dictionary<string, string>
            {
                ["client_id"] = clientId
            };
        }
    }
}
