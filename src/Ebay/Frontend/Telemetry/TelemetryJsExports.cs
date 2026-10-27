using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;

namespace Client.Telemetry;

/// <summary>
/// .NET entry points called from <c>interop.js</c> (<c>[JSExport]</c>, found with <c>getAssemblyExports</c>).
/// </summary>
[SupportedOSPlatform("browser")]
internal static partial class TelemetryJsExports
{
    private static TelemetryExporter? s_exporter;

    public static void Attach(TelemetryExporter exporter) => s_exporter = exporter;

    /// <summary>Called on <c>visibilitychange</c> to hidden: exports at once instead of waiting for the next tick.</summary>
    [JSExport]
    internal static void FlushOnHidden() => s_exporter?.RequestFlush();
}
