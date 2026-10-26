using System.Diagnostics;

namespace Client.Telemetry;

/// <summary>An ended span, copied from its <see cref="Activity"/> when it stopped.</summary>
internal sealed record SpanData(
    string Name,
    ActivityTraceId TraceId,
    ActivitySpanId SpanId,
    ActivitySpanId? ParentSpanId,
    ActivityKind Kind,
    DateTimeOffset Start,
    DateTimeOffset End,
    ActivityStatusCode Status,
    string? StatusDescription,
    IReadOnlyList<KeyValuePair<string, object?>> Attributes,
    IReadOnlyList<SpanEventData> Events,
    IReadOnlyList<SpanLinkData> Links)
{
    public static SpanData From(Activity activity)
    {
        var start = new DateTimeOffset(activity.StartTimeUtc);
        return new SpanData(
            activity.DisplayName,
            activity.TraceId,
            activity.SpanId,
            activity.ParentSpanId == default ? null : activity.ParentSpanId,
            activity.Kind,
            start,
            start + activity.Duration,
            activity.Status,
            activity.StatusDescription,
            [.. activity.TagObjects],
            [.. activity.Events.Select(static e => new SpanEventData(e.Name, e.Timestamp, [.. e.Tags]))],
            [.. activity.Links.Select(static l => new SpanLinkData(l.Context.TraceId, l.Context.SpanId))]);
    }
}
