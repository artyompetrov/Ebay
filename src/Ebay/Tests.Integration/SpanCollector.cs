using System.Collections.Concurrent;
using System.Diagnostics;
using OpenTelemetry;

namespace Tests.Integration;

/// <summary>
/// Exporter added to the test host's tracer provider (after the platform's processors, like the real OTLP exporter).
/// Background jobs and the message bus export spans while tests run, so tests never look at all spans:
/// they send their own trace id and read back only the spans of that trace.
/// </summary>
public sealed class SpanCollector : BaseExporter<Activity>
{
    private const string TraceParentVersion = "00";
    private const string SampledFlag = "01";
    private const string NotSampledFlag = "00";

    private readonly ConcurrentQueue<Activity> _spans = new();

    public override ExportResult Export(in Batch<Activity> batch)
    {
        foreach (var span in batch)
        {
            _spans.Enqueue(span);
        }

        return ExportResult.Success;
    }

    /// <summary>Spans exported so far that belong to the given trace.</summary>
    public Activity[] SpansOf(ActivityTraceId traceId) => [.. _spans.Where(span => span.TraceId == traceId)];

    /// <summary>Spans exported so far that match a predicate.</summary>
    public Activity[] SpansWhere(Func<Activity, bool> predicate) => [.. _spans.Where(predicate)];

    /// <summary>Builds a W3C <c>traceparent</c> header value that makes the server continue the given trace.</summary>
    public static string CreateTraceParent(ActivityTraceId traceId, bool sampled) =>
        $"{TraceParentVersion}-{traceId.ToHexString()}-{ActivitySpanId.CreateRandom().ToHexString()}-{(sampled ? SampledFlag : NotSampledFlag)}";
}
