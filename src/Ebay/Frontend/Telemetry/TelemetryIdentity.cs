using System.Reflection;

namespace Client.Telemetry;

/// <summary>
/// Resource attributes of every exported span and log record (openspec/specs/client-telemetry, "Clients identify
/// themselves in telemetry"): the service name, the build version and a session id that is new for every app load.
/// </summary>
internal sealed record TelemetryIdentity(string ServiceVersion, string SessionId)
{
    public const string ServiceName = "ebay_frontend";

    public static TelemetryIdentity ForCurrentLoad() => new(
        typeof(TelemetryIdentity).Assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion
        ?? string.Empty,
        Guid.NewGuid().ToString("N"));
}
