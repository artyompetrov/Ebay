namespace Tests.Integration;

/// <summary>One exported metric point: its meter, instrument name and labels.</summary>
public sealed record CollectedMetricPoint(string MeterName, string Name, IReadOnlyDictionary<string, object?> Tags);
