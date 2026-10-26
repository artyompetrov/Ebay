using System.Diagnostics;
using AwesomeAssertions;
using Bunit;
using Client.Telemetry;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Tests.Frontend.Telemetry;

/// <summary>Frontend telemetry inside a bUnit context, with the backend client of the app (traced).</summary>
internal sealed class BunitTelemetry
{
    private readonly List<SpanData> _spans = [];

    private BunitTelemetry(BunitContext context)
    {
        Tracer = context.Services.GetRequiredService<FrontendTracer>();
        Buffer = context.Services.GetRequiredService<TelemetryBuffer>();
        context.Services.GetRequiredService<TelemetryActivityListener>();
    }

    public FrontendTracer Tracer { get; }

    public TelemetryBuffer Buffer { get; }

    public static BunitTelemetry Add(BunitContext context, HttpMessageHandler backend)
    {
        TelemetryTestHost.AddTelemetry(context.Services, new FakeBrowserTelemetry(), TimeProvider.System);
        context.Services.AddSingleton(sp => new HttpClient(new TracingMessageHandler(
            sp.GetRequiredService<FrontendTracer>(),
            sp.GetRequiredService<TelemetryLevel>(),
            sp.GetRequiredService<ILoggerFactory>(),
            new Uri(TelemetryTestHost.BaseAddress)) { InnerHandler = backend })
        {
            BaseAddress = new Uri(TelemetryTestHost.BaseAddress)
        });
        return new BunitTelemetry(context);
    }

    /// <summary>Waits until a span matching <paramref name="match"/> was recorded and returns it.</summary>
    public SpanData WaitForSpan(Func<SpanData, bool> match)
    {
        var deadline = DateTimeOffset.UtcNow.AddSeconds(10);
        while (true)
        {
            _spans.AddRange(Buffer.Drain().Spans);
            if (_spans.FirstOrDefault(match) is { } span)
            {
                return span;
            }

            DateTimeOffset.UtcNow.Should().BeBefore(deadline, "the span should have been recorded");
            Thread.Sleep(10);
        }
    }

    /// <summary>The spans recorded so far of the given trace.</summary>
    public IReadOnlyList<SpanData> SpansOf(ActivityTraceId traceId)
    {
        _spans.AddRange(Buffer.Drain().Spans);
        return [.. _spans.Where(s => s.TraceId == traceId)];
    }
}
