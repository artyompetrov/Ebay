using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OpenTelemetry.Logs;

namespace Server.Platform;

/// <summary>
/// Platform-level host setup: configuration sources, DI container validation, logging,
/// telemetry export and health checks. The composition root calls <see cref="AddPlatform"/> once
/// right after creating the builder and <see cref="MapPlatform"/> once when mapping endpoints;
/// everything else is owned by this assembly.
/// </summary>
public static class PlatformExtensions
{
    /// <summary>Path of the liveness endpoint registered by <see cref="MapPlatform"/>.</summary>
    public const string HealthEndpointPath = "/api/health";

    /// <summary>
    /// Applies the platform setup: <c>ASPNETCORE_</c>-prefixed environment configuration, strict DI container
    /// validation (<c>ValidateOnBuild</c>/<c>ValidateScopes</c>), logging (console + OpenTelemetry OTLP export,
    /// configured via the standard <c>OTEL_*</c> environment variables) and health checks.
    /// </summary>
    public static TBuilder AddPlatform<TBuilder>(this TBuilder builder)
        where TBuilder : IHostApplicationBuilder
    {
        builder.Configuration.AddEnvironmentVariables(prefix: "ASPNETCORE_");

        builder.ConfigureContainer(new DefaultServiceProviderFactory(new ServiceProviderOptions
        {
            ValidateOnBuild = true,
            ValidateScopes = true
        }));

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
