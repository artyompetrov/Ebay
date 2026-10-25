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
            .AddApplicationPart(appAssembly)
            // TODO: NSwag generates the DTOs for System.Text.Json ([JsonExtensionData], [JsonConstructor]), but MVC
            // serializes them with Newtonsoft.Json, which ignores those attributes and emits the AdditionalProperties
            // dictionary as an ordinary "additionalProperties" field for every schema that allows extra keys. Switching to
            // System.Text.Json changes request binding for all endpoints (e.g. numbers sent as strings), so it is deferred.
            .AddNewtonsoftJson();

        services.AddRazorPages()
            .AddApplicationPart(appAssembly);
    }
}