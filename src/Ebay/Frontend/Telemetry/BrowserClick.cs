namespace Client.Telemetry;

/// <summary>A click on an element with an id; <see cref="Time"/> is in milliseconds since the Unix epoch.</summary>
internal sealed record BrowserClick(string Id, double Time);
