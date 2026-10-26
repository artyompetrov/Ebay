namespace Client.Telemetry;

/// <summary>
/// Marks the async flow of a telemetry export, so log records written during it (by the HTTP stack, the
/// authorization handler or the exporter itself) are not recorded again.
/// </summary>
internal static class TelemetryExportScope
{
    private static readonly AsyncLocal<bool> Active = new();

    public static bool IsActive => Active.Value;

    /// <summary>Must be called from the async method that exports, so the flag ends with it.</summary>
    public static void Enter() => Active.Value = true;
}
