using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Driving.WebApi.Controllers;

namespace Server.Adapters.Driving.WebApi;

public static class ServiceCollectionExtensions
{
    public static void AddWebApiAdapter(
        this IServiceCollection services)
    {
        var appAssembly = typeof(ServiceCollectionExtensions).Assembly;

        services.AddOptions<ClientTelemetryOptions>()
            .BindConfiguration(ClientTelemetryOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddControllers(options => options.Filters.Add<ErrorFilter>())
            // MVC serializes with System.Text.Json (web defaults: camelCase, case-insensitive names, numbers may come
            // as strings), the library NSwag generates the DTOs for, so their [JsonExtensionData], [JsonConstructor]
            // and string-enum attributes apply on the wire.
            .AddApplicationPart(appAssembly);

        services.AddRazorPages()
            .AddApplicationPart(appAssembly);
    }
}