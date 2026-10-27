namespace Client.Telemetry;

internal sealed record TelemetryBatch(IReadOnlyList<SpanData> Spans, IReadOnlyList<LogData> Logs);
