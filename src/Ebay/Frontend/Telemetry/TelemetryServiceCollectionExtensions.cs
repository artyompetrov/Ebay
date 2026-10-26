using Microsoft.AspNetCore.Components.WebAssembly.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;

namespace Client.Telemetry;

internal static class TelemetryServiceCollectionExtensions
{
    /// <summary>
    /// Registers frontend telemetry (openspec/specs/client-telemetry). The host registers <see cref="IBrowserTelemetry"/>
    /// and calls <see cref="StartFrontendTelemetry"/> after building.
    /// </summary>
    public static IServiceCollection AddFrontendTelemetry(this IServiceCollection services, Uri backendBaseAddress)
    {
        // Telemetry decides per record what it exports (the served level); framework internals stay at Information.
        services.AddLogging(static logging => logging
            .SetMinimumLevel(LogLevel.Trace)
            .AddFilter("Microsoft", LogLevel.Information)
            .AddFilter("System", LogLevel.Information));
        services.TryAddSingleton(TimeProvider.System);
        services.AddSingleton(TelemetryIdentity.ForCurrentLoad());
        services.AddSingleton<TelemetryLevel>();
        services.AddSingleton<TelemetryBuffer>();
        services.AddSingleton<FrontendTracer>();
        services.AddSingleton<TelemetryActivityListener>();
        services.AddSingleton<ILoggerProvider, TelemetryLoggerProvider>();
        services.AddSingleton<ClientTelemetrySettingsSource>();
        services.AddSingleton<BrowserTelemetryCollector>();
        services.AddSingleton<TelemetryExporter>();
        services.AddHttpClient(TelemetryHttpClient.Name, client => client.BaseAddress = backendBaseAddress)
            .AddHttpMessageHandler<BaseAddressAuthorizationMessageHandler>()
            .RemoveAllLoggers();
        return services;
    }

    /// <summary>The handler that traces the calls of the <c>ServerAPI</c> client (outermost, before authorization).</summary>
    public static IHttpClientBuilder AddTracing(this IHttpClientBuilder builder, Uri backendBaseAddress) =>
        builder.AddHttpMessageHandler(sp => new TracingMessageHandler(
            sp.GetRequiredService<FrontendTracer>(),
            sp.GetRequiredService<TelemetryLevel>(),
            sp.GetRequiredService<ILoggerFactory>(),
            backendBaseAddress));

    /// <summary>Starts recording spans and logging unhandled errors.</summary>
    public static TelemetryExporter StartFrontendTelemetry(this IServiceProvider services)
    {
        services.GetRequiredService<TelemetryActivityListener>();
        UnhandledErrorLogging.Subscribe(services.GetRequiredService<ILoggerFactory>());
        return services.GetRequiredService<TelemetryExporter>();
    }
}
