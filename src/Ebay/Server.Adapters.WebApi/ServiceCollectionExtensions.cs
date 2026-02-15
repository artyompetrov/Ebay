using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.WebApi.Controllers;

namespace Server.Adapters.WebApi;

public static class ServiceCollectionExtensions
{
    public static void AddWebApiAdapter(
        this IServiceCollection services)
    {
        _ = services.AddControllers().AddApplicationPart(typeof(WebApiController).Assembly);
    }
}