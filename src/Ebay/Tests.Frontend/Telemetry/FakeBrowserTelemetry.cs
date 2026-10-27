using System.Collections.Concurrent;
using Client.Telemetry;

namespace Tests.Frontend.Telemetry;

internal sealed class FakeBrowserTelemetry : IBrowserTelemetry
{
    private readonly ConcurrentQueue<BrowserClick> _clicks = new();

    public double TimeOrigin { get; init; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

    public BootTiming Boot { get; init; } = new(null, null, 0, 0, null, null);

    public void Click(string id, DateTimeOffset time) => _clicks.Enqueue(new BrowserClick(id, (time - DateTimeOffset.UnixEpoch).TotalMilliseconds));

    public IReadOnlyList<BrowserClick> TakeClicks()
    {
        var clicks = new List<BrowserClick>();
        while (_clicks.TryDequeue(out var click))
        {
            clicks.Add(click);
        }

        return clicks;
    }

    public BootTiming TakeBootTiming() => Boot;

    public BrowserEvents TakeEvents() => BrowserEvents.None;
}
