namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// The telemetry store refused a batch as invalid; sending it again would not help.
/// </summary>
public sealed record ClientTelemetryBatchRejected(string Reason);
