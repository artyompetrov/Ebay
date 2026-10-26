using System.Buffers;
using System.Diagnostics;
using System.Globalization;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace Client.Telemetry;

/// <summary>
/// Writes OTLP/JSON <c>ExportTraceServiceRequest</c>/<c>ExportLogsServiceRequest</c> bodies (hex ids, nanosecond
/// times as strings, OTLP span kind, status and severity numbers). String values lose URL query strings and are cut
/// to <see cref="MaxValueLength"/> characters.
/// </summary>
internal static class OtlpJsonSerializer
{
    public const int MaxValueLength = 4096;

    private const string ScopeName = FrontendActivitySource.Name;
    private const long NanosecondsPerTick = 100;
    private const int SampledFlags = 1;

    public static byte[] SerializeSpans(TelemetryIdentity identity, IReadOnlyList<SpanData> spans)
    {
        var buffer = new ArrayBufferWriter<byte>();
        using (var writer = new Utf8JsonWriter(buffer))
        {
            writer.WriteStartObject();
            writer.WriteStartArray("resourceSpans");
            writer.WriteStartObject();
            WriteResource(writer, identity);
            writer.WriteStartArray("scopeSpans");
            writer.WriteStartObject();
            WriteScope(writer, ScopeName);
            writer.WriteStartArray("spans");
            foreach (var span in spans)
            {
                WriteSpan(writer, span);
            }

            writer.WriteEndArray();
            writer.WriteEndObject();
            writer.WriteEndArray();
            writer.WriteEndObject();
            writer.WriteEndArray();
            writer.WriteEndObject();
        }

        return buffer.WrittenSpan.ToArray();
    }

    public static byte[] SerializeLogs(TelemetryIdentity identity, IReadOnlyList<LogData> logs)
    {
        var buffer = new ArrayBufferWriter<byte>();
        using (var writer = new Utf8JsonWriter(buffer))
        {
            writer.WriteStartObject();
            writer.WriteStartArray("resourceLogs");
            writer.WriteStartObject();
            WriteResource(writer, identity);
            writer.WriteStartArray("scopeLogs");
            // One scope per logger category, as the OpenTelemetry .NET SDK does.
            foreach (var category in logs.GroupBy(static l => l.Category, StringComparer.Ordinal))
            {
                writer.WriteStartObject();
                WriteScope(writer, category.Key);
                writer.WriteStartArray("logRecords");
                foreach (var log in category)
                {
                    WriteLog(writer, log);
                }

                writer.WriteEndArray();
                writer.WriteEndObject();
            }

            writer.WriteEndArray();
            writer.WriteEndObject();
            writer.WriteEndArray();
            writer.WriteEndObject();
        }

        return buffer.WrittenSpan.ToArray();
    }

    /// <summary>Removes URL query strings and cuts the value to <see cref="MaxValueLength"/> characters.</summary>
    public static string Clean(string value)
    {
        var scrubbed = UrlQueryScrubber.Scrub(value);
        return scrubbed.Length <= MaxValueLength ? scrubbed : scrubbed[..MaxValueLength];
    }

    private static void WriteResource(Utf8JsonWriter writer, TelemetryIdentity identity)
    {
        writer.WriteStartObject("resource");
        WriteAttributes(writer,
        [
            new("service.name", TelemetryIdentity.ServiceName),
            new("service.version", identity.ServiceVersion),
            new("session.id", identity.SessionId)
        ]);
        writer.WriteEndObject();
    }

    private static void WriteScope(Utf8JsonWriter writer, string name)
    {
        writer.WriteStartObject("scope");
        writer.WriteString("name", name);
        writer.WriteEndObject();
    }

    private static void WriteSpan(Utf8JsonWriter writer, SpanData span)
    {
        writer.WriteStartObject();
        writer.WriteString("traceId", span.TraceId.ToHexString());
        writer.WriteString("spanId", span.SpanId.ToHexString());
        if (span.ParentSpanId is { } parent)
        {
            writer.WriteString("parentSpanId", parent.ToHexString());
        }

        writer.WriteNumber("flags", SampledFlags);
        writer.WriteString("name", Clean(span.Name));
        writer.WriteNumber("kind", ToOtlpKind(span.Kind));
        writer.WriteString("startTimeUnixNano", ToUnixNano(span.Start));
        writer.WriteString("endTimeUnixNano", ToUnixNano(span.End));
        WriteAttributes(writer, span.Attributes);
        writer.WriteStartArray("events");
        foreach (var spanEvent in span.Events)
        {
            writer.WriteStartObject();
            writer.WriteString("timeUnixNano", ToUnixNano(spanEvent.Time));
            writer.WriteString("name", spanEvent.Name);
            WriteAttributes(writer, spanEvent.Attributes);
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
        writer.WriteStartArray("links");
        foreach (var link in span.Links)
        {
            writer.WriteStartObject();
            writer.WriteString("traceId", link.TraceId.ToHexString());
            writer.WriteString("spanId", link.SpanId.ToHexString());
            writer.WriteNumber("flags", SampledFlags);
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
        writer.WriteStartObject("status");
        writer.WriteNumber("code", (int)span.Status);
        if (span.StatusDescription is { } description)
        {
            writer.WriteString("message", Clean(description));
        }

        writer.WriteEndObject();
        writer.WriteEndObject();
    }

    private static void WriteLog(Utf8JsonWriter writer, LogData log)
    {
        var time = ToUnixNano(log.Time);
        writer.WriteStartObject();
        writer.WriteString("timeUnixNano", time);
        writer.WriteString("observedTimeUnixNano", time);
        writer.WriteNumber("severityNumber", ToSeverityNumber(log.Level));
        writer.WriteString("severityText", log.Level.ToString());
        writer.WriteStartObject("body");
        writer.WriteString("stringValue", Clean(log.Message));
        writer.WriteEndObject();
        WriteAttributes(writer, log.Attributes);
        if (log is { TraceId: { } traceId, SpanId: { } spanId })
        {
            writer.WriteString("traceId", traceId.ToHexString());
            writer.WriteString("spanId", spanId.ToHexString());
            writer.WriteNumber("flags", SampledFlags);
        }

        writer.WriteEndObject();
    }

    private static void WriteAttributes(Utf8JsonWriter writer, IEnumerable<KeyValuePair<string, object?>> attributes)
    {
        writer.WriteStartArray("attributes");
        foreach (var (key, value) in attributes)
        {
            if (value is null)
            {
                continue;
            }

            writer.WriteStartObject();
            writer.WriteString("key", key);
            writer.WriteStartObject("value");
            switch (value)
            {
                case bool boolean:
                    writer.WriteBoolean("boolValue", boolean);
                    break;
                case int or long or short or byte or uint:
                    writer.WriteString("intValue", Convert.ToInt64(value, CultureInfo.InvariantCulture).ToString(CultureInfo.InvariantCulture));
                    break;
                case double or float or decimal:
                    writer.WriteNumber("doubleValue", Convert.ToDouble(value, CultureInfo.InvariantCulture));
                    break;
                default:
                    writer.WriteString("stringValue", Clean(Convert.ToString(value, CultureInfo.InvariantCulture) ?? string.Empty));
                    break;
            }

            writer.WriteEndObject();
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static string ToUnixNano(DateTimeOffset time) =>
        ((time.UtcTicks - DateTimeOffset.UnixEpoch.UtcTicks) * NanosecondsPerTick).ToString(CultureInfo.InvariantCulture);

    // OTLP numbers: SPAN_KIND_INTERNAL = 1, SERVER = 2, CLIENT = 3, PRODUCER = 4, CONSUMER = 5.
    private static int ToOtlpKind(ActivityKind kind) => kind switch
    {
        ActivityKind.Internal => 1,
        ActivityKind.Server => 2,
        ActivityKind.Client => 3,
        ActivityKind.Producer => 4,
        ActivityKind.Consumer => 5,
        _ => throw new UnreachableException($"Unknown activity kind {kind}.")
    };

    // OTLP severity numbers: TRACE = 1, DEBUG = 5, INFO = 9, WARN = 13, ERROR = 17, FATAL = 21.
    private static int ToSeverityNumber(LogLevel level) => level switch
    {
        LogLevel.Trace => 1,
        LogLevel.Debug => 5,
        LogLevel.Information => 9,
        LogLevel.Warning => 13,
        LogLevel.Error => 17,
        LogLevel.Critical => 21,
        LogLevel.None => throw new UnreachableException("A record with level None is never written."),
        _ => throw new UnreachableException($"Unknown log level {level}.")
    };
}
