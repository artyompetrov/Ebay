namespace Server.Application.ClientTelemetry;

/// <summary>
/// The batch is larger than <see cref="ClientTelemetryService.MaxBatchBytes"/>; nothing of it was forwarded.
/// </summary>
public sealed record ClientTelemetryBatchTooLarge;
