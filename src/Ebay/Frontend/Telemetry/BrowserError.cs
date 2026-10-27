namespace Client.Telemetry;

/// <summary>An uncaught JS error or unhandled promise rejection.</summary>
internal sealed record BrowserError(string Type, string Message, string? Stack, double Time);
