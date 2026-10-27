using System.Text.Json;

namespace Tests.Frontend;

/// <summary>Reads exported OTLP/JSON bodies back for assertions.</summary>
internal static class OtlpJson
{
    public static IReadOnlyList<ExportedSpan> Spans(string body)
    {
        using var document = JsonDocument.Parse(body);
        return
        [
            .. document.RootElement.GetProperty("resourceSpans").EnumerateArray()
                .SelectMany(static r => r.GetProperty("scopeSpans").EnumerateArray().Select(s => (Resource: r, Scope: s)))
                .SelectMany(static rs => rs.Scope.GetProperty("spans").EnumerateArray().Select(span => new ExportedSpan(
                    span.GetProperty("traceId").GetString()!,
                    span.GetProperty("spanId").GetString()!,
                    span.TryGetProperty("parentSpanId", out var parent) ? parent.GetString() : null,
                    span.GetProperty("name").GetString()!,
                    long.Parse(span.GetProperty("startTimeUnixNano").GetString()!, System.Globalization.CultureInfo.InvariantCulture),
                    span.GetProperty("status").GetProperty("code").GetInt32(),
                    Attributes(span),
                    [.. span.GetProperty("events").EnumerateArray().Select(static e => e.GetProperty("name").GetString()!)],
                    [.. span.GetProperty("links").EnumerateArray().Select(static l => l.GetProperty("spanId").GetString()!)],
                    Attributes(rs.Resource.GetProperty("resource")))))
        ];
    }

    public static IReadOnlyList<ExportedLog> Logs(string body)
    {
        using var document = JsonDocument.Parse(body);
        return
        [
            .. document.RootElement.GetProperty("resourceLogs").EnumerateArray()
                .SelectMany(static r => r.GetProperty("scopeLogs").EnumerateArray().Select(s => (Resource: r, Scope: s)))
                .SelectMany(static rs => rs.Scope.GetProperty("logRecords").EnumerateArray().Select(log => new ExportedLog(
                    rs.Scope.GetProperty("scope").GetProperty("name").GetString()!,
                    log.GetProperty("severityNumber").GetInt32(),
                    log.GetProperty("body").GetProperty("stringValue").GetString()!,
                    log.TryGetProperty("traceId", out var traceId) ? traceId.GetString() : null,
                    log.TryGetProperty("spanId", out var spanId) ? spanId.GetString() : null,
                    Attributes(log),
                    Attributes(rs.Resource.GetProperty("resource")))))
        ];
    }

    private static Dictionary<string, string> Attributes(JsonElement owner) =>
        owner.GetProperty("attributes").EnumerateArray().ToDictionary(
            static a => a.GetProperty("key").GetString()!,
            static a => a.GetProperty("value").EnumerateObject().Single().Value.ToString());

    internal sealed record ExportedSpan(
        string TraceId,
        string SpanId,
        string? ParentSpanId,
        string Name,
        long StartTimeUnixNano,
        int StatusCode,
        IReadOnlyDictionary<string, string> Attributes,
        IReadOnlyList<string> Events,
        IReadOnlyList<string> LinkedSpanIds,
        IReadOnlyDictionary<string, string> Resource);

    internal sealed record ExportedLog(
        string Scope,
        int SeverityNumber,
        string Body,
        string? TraceId,
        string? SpanId,
        IReadOnlyDictionary<string, string> Attributes,
        IReadOnlyDictionary<string, string> Resource);
}
