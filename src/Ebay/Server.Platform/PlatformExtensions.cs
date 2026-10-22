using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Npgsql;
using OpenTelemetry.Logs;
using OpenTelemetry.Trace;
using Server.Platform.Tracing;

namespace Server.Platform;

/// <summary>
/// Platform-level host setup: configuration sources, DI container validation, logging,
/// tracing, telemetry export and health checks. The composition root calls <see cref="AddPlatform"/> once
/// right after creating the builder and <see cref="MapPlatform"/> once when mapping endpoints;
/// everything else is owned by this assembly.
/// </summary>
public static class PlatformExtensions
{
    /// <summary>Path of the liveness endpoint registered by <see cref="MapPlatform"/>.</summary>
    public const string HealthEndpointPath = "/api/health";

    /// <summary>
    /// Pattern of our own <see cref="System.Diagnostics.ActivitySource"/> names: every source whose name starts
    /// with <c>Server.</c> is exported, so adapters and the application don't need to register their sources here.
    /// </summary>
    internal const string ApplicationSourcesPattern = "Server.*";

    /// <summary>MassTransit's own source: message spans give database commands inside consumers a parent span.</summary>
    internal const string MassTransitSourceName = "MassTransit";

    /// <summary>
    /// Applies the platform setup: <c>ASPNETCORE_</c>-prefixed environment configuration, strict DI container
    /// validation (<c>ValidateOnBuild</c>/<c>ValidateScopes</c>), logging (console + OpenTelemetry OTLP export),
    /// tracing (incoming and outgoing HTTP, database commands and our own <c>Server.*</c> sources, OTLP export)
    /// and health checks. OTLP export of both signals is configured via the standard <c>OTEL_*</c> environment variables.
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
        // TODO: request logs (ASP.NET Core "Request finished" records) still carry query strings, which tracing
        // deliberately drops; scrub them from logs as well.
        builder.Logging.AddOpenTelemetry(o =>
        {
            o.IncludeScopes = true;
            o.IncludeFormattedMessage = true;
            o.ParseStateValues = true;
            o.AddOtlpExporter();
        });

        builder.Services.AddOpenTelemetry().WithTracing(static tracing => tracing
            // Keep every trace, even when the caller's traceparent says "not sampled": traffic is low and the
            // trace someone needs to investigate must not be the one that was sampled out. Only children of spans
            // we dropped ourselves (filtered requests) are dropped too, so they don't show up as orphan traces.
            // TODO: a message published under a filtered request still carries that request's trace id with the
            // sampled flag off, and its consumer (a remote parent here) is recorded under a parent that was never
            // exported. No filtered path publishes messages today; if one does, drop such consumer spans too.
            .SetSampler(new ParentBasedSampler(
                new AlwaysOnSampler(),
                remoteParentSampled: new AlwaysOnSampler(),
                remoteParentNotSampled: new AlwaysOnSampler(),
                localParentSampled: new AlwaysOnSampler(),
                localParentNotSampled: new AlwaysOffSampler()))
            .AddSource(ApplicationSourcesPattern, MassTransitSourceName)
            .AddAspNetCoreInstrumentation(static o => o.Filter = static context => TracedRequestFilter.IsTraced(context.Request.Path))
            .AddHttpClientInstrumentation()
            .AddNpgsql()
            // Processors run in registration order, so both must be added before the exporter.
            .AddProcessor(new OrphanDatabaseSpanFilter())
            .AddProcessor(new UrlQueryScrubber())
            .AddOtlpExporter());

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
