namespace Client.Telemetry;

internal sealed record BrowserEvents(IReadOnlyList<BrowserVital> Vitals, IReadOnlyList<BrowserError> Errors)
{
    public static readonly BrowserEvents None = new([], []);
}
