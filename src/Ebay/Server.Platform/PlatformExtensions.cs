using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OpenTelemetry.Logs;

namespace Server.Platform;

/// <summary>
/// Platform-level observability: logging, telemetry export and health checks.
/// The composition root only calls <see cref="AddPlatform"/> and <see cref="MapPlatform"/>;
/// everything else (providers, exporters, endpoints) is owned by this assembly.
/// </summary>
public static class PlatformExtensions
{
    /// <summary>Path of the liveness endpoint registered by <see cref="MapPlatform"/>.</summary>
    public const string HealthEndpointPath = "/api/health";

    /// <summary>
    /// Registers logging (console + OpenTelemetry OTLP export) and health checks.
    /// The OTLP exporter is configured via the standard <c>OTEL_*</c> environment variables.
    /// </summary>
    public static TBuilder AddPlatform<TBuilder>(this TBuilder builder)
        where TBuilder : IHostApplicationBuilder
    {
        builder.Logging.ClearProviders();
        builder.Logging.AddConsole();
        builder.Logging.SetMinimumLevel(LogLevel.Information);
        builder.Logging.AddOpenTelemetry(o =>
        {
            o.IncludeScopes = true;
            o.IncludeFormattedMessage = true;
            o.ParseStateValues = true;
            o.AddOtlpExporter();
        });

        builder.Services.AddHealthChecks();

        return builder;
    }

    /// <summary>Maps the observability endpoints (currently the health check at <see cref="HealthEndpointPath"/>).</summary>
    public static IEndpointRouteBuilder MapPlatform(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapHealthChecks(HealthEndpointPath);
        return endpoints;
    }
}
