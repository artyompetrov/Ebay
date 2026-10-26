using System.Diagnostics;

namespace Client.Telemetry;

internal sealed record SpanLinkData(ActivityTraceId TraceId, ActivitySpanId SpanId);
