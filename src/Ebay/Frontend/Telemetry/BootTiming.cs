namespace Client.Telemetry;

/// <summary>
/// Timing of the initial page load, in milliseconds since the Unix epoch; <c>null</c> when the browser does not know
/// it yet. <see cref="FrameworkStart"/>/<see cref="FrameworkEnd"/> span the downloads of <c>_framework/*</c>.
/// </summary>
internal sealed record BootTiming(
    double? ResponseEnd,
    double? DomContentLoaded,
    int FrameworkResources,
    long FrameworkBytes,
    double? FrameworkStart,
    double? FrameworkEnd);
