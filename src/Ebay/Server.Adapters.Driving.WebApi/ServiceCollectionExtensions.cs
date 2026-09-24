using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Driving.WebApi.Controllers;
using Server.Controllers.Generated;

namespace Server.Adapters.Driving.WebApi;

public static class ServiceCollectionExtensions
{
    public static void AddWebApiAdapter(
        this IServiceCollection services)
    {
        var appAssembly = typeof(ServiceCollectionExtensions).Assembly;

        services.AddControllers(options => options.Filters.Add<ErrorFilter>())
            .AddApplicationPart(appAssembly)
            .AddNewtonsoftJson();

        services.AddTransient<IEbayController, EbayControllerImplementation>();

        services.AddRazorPages()
            .AddApplicationPart(appAssembly);
    }
}