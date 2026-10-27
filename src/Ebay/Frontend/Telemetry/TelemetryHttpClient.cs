namespace Client.Telemetry;

/// <summary>
/// The named client of telemetry export: it attaches the access token, but has no tracing handler and no
/// <c>HttpClient</c> loggers, so export calls are neither traced nor logged.
/// </summary>
internal static class TelemetryHttpClient
{
    public const string Name = "Telemetry";
}
