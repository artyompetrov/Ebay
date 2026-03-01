using Microsoft.Extensions.DependencyInjection;

namespace Server.Adapters.Driving.WebApi;

public static class ServiceCollectionExtensions
{
    public static void AddWebApiAdapter(
        this IServiceCollection services)
    {
        var appAssembly = typeof(ServiceCollectionExtensions).Assembly;

        services.AddControllers()
            .AddApplicationPart(appAssembly);

        services.AddRazorPages()
            .AddApplicationPart(appAssembly);
    }
}