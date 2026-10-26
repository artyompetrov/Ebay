namespace Client.Telemetry;

internal sealed record SpanEventData(string Name, DateTimeOffset Time, IReadOnlyList<KeyValuePair<string, object?>> Attributes);
