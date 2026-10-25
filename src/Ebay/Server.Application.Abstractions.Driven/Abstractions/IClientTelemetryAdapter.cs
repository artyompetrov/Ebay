using OneOf;
using OneOf.Types;

namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Port to the telemetry store (the OpenTelemetry collector) that receives the OTLP/JSON batches of browser clients.
/// </summary>
public interface IClientTelemetryAdapter
{
    /// <summary>
    /// Sends one OTLP/JSON batch unchanged, once, without retrying. Returns <see cref="ClientTelemetryBatchRejected"/>
    /// when the store refuses the batch as invalid and <see cref="Error{T}"/> when the store fails or is unreachable.
    /// </summary>
    Task<OneOf<Success, ClientTelemetryBatchRejected, Error<string>>> ForwardAsync(
        ClientTelemetrySignal signal,
        ReadOnlyMemory<byte> batch,
        CancellationToken cancellationToken);
}
