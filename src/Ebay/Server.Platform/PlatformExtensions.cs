using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Npgsql;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
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
    /// MailKit's SMTP client source. MailKit creates it only after <c>MailKit.Telemetry.SmtpClient.Configure()</c>,
    /// which the SMTP adapter calls, so the platform does not need to reference MailKit.
    /// </summary>
    internal const string MailKitSmtpSourceName = "MailKit.Net.SmtpClient";

    /// <summary>Pattern of our own <see cref="System.Diagnostics.Metrics.Meter"/> names, same rule as for span sources.</summary>
    internal const string ApplicationMetersPattern = "Server.*";

    /// <summary>The .NET runtime's built-in meter (GC, thread pool, JIT, exceptions, memory).</summary>
    internal const string RuntimeMeterName = "System.Runtime";

    /// <summary>MassTransit's own meter (messages received, consumed, published and their durations).</summary>
    internal const string MassTransitMeterName = "MassTransit";

    /// <summary>MailKit's SMTP client meter, enabled by the SMTP adapter like its span source.</summary>
    internal const string MailKitSmtpMeterName = "mailkit.net.smtp";

    /// <summary>MailKit's socket meter (connection counts and durations), enabled by the SMTP adapter.</summary>
    internal const string MailKitSocketMeterName = "mailkit.net.socket";

    /// <summary>
    /// Applies the platform setup: <c>ASPNETCORE_</c>-prefixed environment configuration, strict DI container
    /// validation (<c>ValidateOnBuild</c>/<c>ValidateScopes</c>), logging (console + OpenTelemetry OTLP export),
    /// tracing (incoming and outgoing HTTP, database commands, messages, email and our own <c>Server.*</c> sources),
    /// metrics (requests, outgoing HTTP, database client, messages, email, runtime and our own <c>Server.*</c> meters)
    /// and health checks. OTLP export of all three signals is configured via the standard <c>OTEL_*</c> environment variables.
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
            .AddSource(ApplicationSourcesPattern, MassTransitSourceName, MailKitSmtpSourceName)
            .AddAspNetCoreInstrumentation(static o =>
            {
                o.Filter = static context => TracedRequestFilter.IsTraced(context.Request.Path);
                // Only unhandled exceptions reach the instrumentation; the Web API adapter's error filter records
                // the exceptions it answers itself.
                o.RecordException = true;
            })
            .AddHttpClientInstrumentation(static o => o.RecordException = true)
            .AddNpgsql()
            // Processors run in registration order, so both must be added before the exporter.
            .AddProcessor(new OrphanDatabaseSpanFilter())
            .AddProcessor(new UrlQueryScrubber())
            .AddOtlpExporter())
            .WithMetrics(static metrics => metrics
                .AddAspNetCoreInstrumentation()
                .AddHttpClientInstrumentation()
                .AddNpgsqlInstrumentation()
                .AddMeter(
                    ApplicationMetersPattern,
                    RuntimeMeterName,
                    MassTransitMeterName,
                    MailKitSmtpMeterName,
                    MailKitSocketMeterName)
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
