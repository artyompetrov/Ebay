using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.OtlpCollector;

public static class ServiceCollectionExtensions
{
    public static void AddOtlpCollectorAdapter(this IServiceCollection services)
    {
        services.AddOptions<OtlpCollectorAdapterOptions>()
            .BindConfiguration(OtlpCollectorAdapterOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddHttpClient(OtlpCollectorAdapter.HttpClientName, static (serviceProvider, client) =>
                client.BaseAddress = WithTrailingSlash(serviceProvider.GetRequiredService<IOptions<OtlpCollectorAdapterOptions>>().Value.Endpoint))
            // Clients export every few seconds: per-request HttpClient logs of the relay would only be noise.
            .RemoveAllLoggers();
        services.AddSingleton<IClientTelemetryAdapter, OtlpCollectorAdapter>();
    }

    /// <summary>
    /// The signal paths are relative, so the base address must end with a slash to keep any path prefix it has.
    /// </summary>
    private static Uri WithTrailingSlash(Uri endpoint) =>
        endpoint.AbsoluteUri.EndsWith('/') ? endpoint : new Uri(endpoint.AbsoluteUri + "/");
}
