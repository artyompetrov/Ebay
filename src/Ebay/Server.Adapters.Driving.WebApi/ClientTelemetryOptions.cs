using Microsoft.Extensions.Logging;
using Server.Adapters.Driving.WebApi.Generated;

namespace Server.Adapters.Driving.WebApi;

/// <summary>
/// Telemetry settings served to the browser clients (openspec/specs/client-telemetry), e.g.
/// <c>ClientTelemetry__MinLevel=Trace</c> to also export backend request and response bodies.
/// </summary>
public sealed record class ClientTelemetryOptions
{
    public const string SectionName = "ClientTelemetry";

    public LogLevel MinLevel { get; init; } = LogLevel.Debug;

    /// <summary>
    /// The settings answer clients receive.
    /// </summary>
    internal ClientTelemetrySettings ToSettings() => new(MinLevel.ToString());
}
