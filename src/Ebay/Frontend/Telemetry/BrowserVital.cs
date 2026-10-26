namespace Client.Telemetry;

/// <summary>A Web Vital (<c>lcp</c>, <c>cls</c>, <c>inp</c>) or a long animation frame (<c>long_animation_frame</c>, value = duration in ms).</summary>
internal sealed record BrowserVital(string Name, double Value, double Time, double? BlockingDuration);
