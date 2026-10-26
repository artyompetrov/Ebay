using Client.Telemetry;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.WebAssembly.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Tests.Frontend.Telemetry;

/// <summary>
/// The frontend's real telemetry registration (<see cref="TelemetryServiceCollectionExtensions.AddFrontendTelemetry"/>,
/// the authorization handler of <c>AddApiAuthorization</c>) with fake browser, clock, tokens and relay.
/// Spans of every test reach every listener, so tests look only at the traces they started.
/// </summary>
internal sealed class TelemetryTestHost : IDisposable
{
    public const string BaseAddress = "https://test.local/";

    private readonly ServiceProvider _services;

    public TelemetryTestHost(Action<IServiceCollection>? configure = null)
    {
        var services = new ServiceCollection();
        AddTelemetry(services, Browser, Time);
        services.AddApiAuthorization();
        services.AddSingleton<NavigationManager>(Navigation);
        services.AddSingleton<IAccessTokenProvider>(Tokens);
        services.AddHttpClient(TelemetryHttpClient.Name).ConfigurePrimaryHttpMessageHandler(() => Relay);
        configure?.Invoke(services);
        _services = services.BuildServiceProvider();
        _services.StartFrontendTelemetry();
    }

    public FakeBrowserTelemetry Browser { get; } = new();

    public ManualTimeProvider Time { get; } = new();

    public FakeNavigationManager Navigation { get; } = new();

    public FakeAccessTokenProvider Tokens { get; } = new();

    public RecordingRelay Relay { get; } = new();

    public IServiceProvider Services => _services;

    public FrontendTracer Tracer => _services.GetRequiredService<FrontendTracer>();

    public TelemetryBuffer Buffer => _services.GetRequiredService<TelemetryBuffer>();

    public TelemetryLevel Level => _services.GetRequiredService<TelemetryLevel>();

    public TelemetryExporter Exporter => _services.GetRequiredService<TelemetryExporter>();

    public ILoggerFactory LoggerFactory => _services.GetRequiredService<ILoggerFactory>();

    /// <summary>Registers telemetry for a component test (bUnit) and starts recording.</summary>
    public static void AddTelemetry(IServiceCollection services, FakeBrowserTelemetry browser, TimeProvider time)
    {
        services.AddLogging();
        services.AddSingleton<TimeProvider>(time);
        services.AddSingleton<IBrowserTelemetry>(browser);
        services.AddFrontendTelemetry(new Uri(BaseAddress));
    }

    /// <summary>A client of the backend through the tracing handler, as the <c>ServerAPI</c> client.</summary>
    public HttpClient CreateTracedClient(HttpMessageHandler backend) =>
        new(new TracingMessageHandler(Tracer, Level, LoggerFactory, new Uri(BaseAddress)) { InnerHandler = backend })
        {
            BaseAddress = new Uri(BaseAddress)
        };

    /// <summary>The spans recorded so far of the given traces (other tests' spans are dropped).</summary>
    public IReadOnlyList<SpanData> SpansOf(params System.Diagnostics.ActivityTraceId[] traceIds) =>
        [.. Buffer.Drain().Spans.Where(s => traceIds.Contains(s.TraceId))];

    /// <summary>Leaves only the spans and records of the given traces pending (other tests' are dropped) and returns them.</summary>
    public TelemetryBatch KeepOnly(params System.Diagnostics.ActivityTraceId[] traceIds)
    {
        var all = Buffer.Drain();
        var kept = new TelemetryBatch(
            [.. all.Spans.Where(s => traceIds.Contains(s.TraceId))],
            [.. all.Logs.Where(l => l.TraceId is { } traceId && traceIds.Contains(traceId))]);
        foreach (var span in kept.Spans)
        {
            Buffer.Add(span);
        }

        foreach (var log in kept.Logs)
        {
            Buffer.Add(log);
        }

        return kept;
    }

    public void Dispose() => _services.Dispose();
}
