using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Configuration;

namespace Server.Adapters.Driven.OtlpCollector;

/// <summary>
/// Address of the OpenTelemetry collector. It is the same standard <c>OTEL_EXPORTER_OTLP_ENDPOINT</c> variable the
/// backend exports its own telemetry with, so the relay needs no setting of its own.
/// </summary>
internal sealed record class OtlpCollectorAdapterOptions
{
    /// <summary>
    /// The standard OTLP variable lives at the configuration root, not in a section.
    /// </summary>
    public const string SectionName = "";

    /// <summary>
    /// Default of the OTLP/HTTP exporters when the variable is not set.
    /// </summary>
    private const string DefaultEndpoint = "http://localhost:4318";

    [Required]
    [ConfigurationKeyName("OTEL_EXPORTER_OTLP_ENDPOINT")]
    public Uri Endpoint { get; init; } = new(DefaultEndpoint);
}
