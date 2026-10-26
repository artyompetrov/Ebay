using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using System.Text.Json;

namespace Client.Telemetry;

/// <summary>
/// Reads what <c>interop.js</c> collected. These calls are not traced themselves: they run on every export tick.
/// </summary>
[SupportedOSPlatform("browser")]
internal sealed partial class BrowserTelemetry : IBrowserTelemetry
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public double TimeOrigin => GetTimeOriginJs();

    /// <summary>Starts the click, performance and error observers and the flush on hide.</summary>
    public static Task StartAsync() => StartTelemetryCollectionJs();

    public IReadOnlyList<BrowserClick> TakeClicks() => JsonSerializer.Deserialize<BrowserClick[]>(TakeClicksJs(), JsonOptions) ?? [];

    public BootTiming TakeBootTiming() =>
        JsonSerializer.Deserialize<BootTiming>(TakeBootTimingJs(), JsonOptions)
        ?? new BootTiming(null, null, 0, 0, null, null);

    public BrowserEvents TakeEvents() => JsonSerializer.Deserialize<BrowserEvents>(TakeTelemetryEventsJs(), JsonOptions) ?? BrowserEvents.None;

    [JSImport(functionName: "StartTelemetryCollection", moduleName: "interop")]
    private static partial Task StartTelemetryCollectionJs();

    [JSImport(functionName: "GetTimeOrigin", moduleName: "interop")]
    private static partial double GetTimeOriginJs();

    [JSImport(functionName: "TakeClicks", moduleName: "interop")]
    private static partial string TakeClicksJs();

    [JSImport(functionName: "TakeBootTiming", moduleName: "interop")]
    private static partial string TakeBootTimingJs();

    [JSImport(functionName: "TakeTelemetryEvents", moduleName: "interop")]
    private static partial string TakeTelemetryEventsJs();
}
