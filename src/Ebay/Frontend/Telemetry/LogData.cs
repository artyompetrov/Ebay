using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace Client.Telemetry;

/// <summary>A log record waiting for export; <see cref="TraceId"/>/<see cref="SpanId"/> name the span it was written in.</summary>
internal sealed record LogData(
    DateTimeOffset Time,
    LogLevel Level,
    string Category,
    string Message,
    ActivityTraceId? TraceId,
    ActivitySpanId? SpanId,
    IReadOnlyList<KeyValuePair<string, object?>> Attributes);
