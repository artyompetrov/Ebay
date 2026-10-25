using Microsoft.Extensions.Logging;
using OneOf;
using OneOf.Types;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Application.ClientTelemetry;

/// <summary>
/// Use case that relays telemetry batches of the browser clients (Chrome extension, Blazor frontend) to the
/// telemetry store (openspec/specs/client-telemetry).
/// </summary>
public sealed class ClientTelemetryService
{
    /// <summary>
    /// Largest batch a client may send.
    /// </summary>
    public const int MaxBatchBytes = 1024 * 1024;

    private const int ReadChunkBytes = 64 * 1024;

    private readonly IClientTelemetryAdapter _clientTelemetryAdapter;
    private readonly ILogger<ClientTelemetryService> _logger;

    /// <summary>
    /// Creates the client telemetry relay use case.
    /// </summary>
    public ClientTelemetryService(IClientTelemetryAdapter clientTelemetryAdapter, ILogger<ClientTelemetryService> logger)
    {
        _clientTelemetryAdapter = clientTelemetryAdapter;
        _logger = logger;
    }

    /// <summary>
    /// Reads the whole batch (at most <see cref="MaxBatchBytes"/>) and forwards it unchanged. A batch that is
    /// declared or turns out to be larger is answered with <see cref="ClientTelemetryBatchTooLarge"/> and
    /// nothing of it is forwarded.
    /// </summary>
    /// <param name="signal">Signal of the batch.</param>
    /// <param name="body">Raw OTLP/JSON batch.</param>
    /// <param name="declaredLength">Length the client declared for the body, when it declared one.</param>
    /// <param name="cancellationToken">Cancellation token of the request.</param>
    public async Task<OneOf<Success, ClientTelemetryBatchTooLarge, ClientTelemetryBatchRejected, Error<string>>> ForwardAsync(
        ClientTelemetrySignal signal,
        Stream body,
        long? declaredLength,
        CancellationToken cancellationToken)
    {
        if (declaredLength > MaxBatchBytes)
        {
            return new ClientTelemetryBatchTooLarge();
        }

        var batch = await ReadAtMostAsync(body, MaxBatchBytes + 1, cancellationToken);
        if (batch.Length > MaxBatchBytes)
        {
            return new ClientTelemetryBatchTooLarge();
        }

        var forwarded = await _clientTelemetryAdapter.ForwardAsync(signal, batch, cancellationToken);
        // Clients drop a failed batch without telling anyone, so this is the only place a lost batch is visible.
        return forwarded.Match<OneOf<Success, ClientTelemetryBatchTooLarge, ClientTelemetryBatchRejected, Error<string>>>(
            static success => success,
            rejected =>
            {
                _logger.LogWarning("A client {Signal} batch of {Bytes} bytes was rejected: {Reason}", signal, batch.Length, rejected.Reason);
                return rejected;
            },
            error =>
            {
                _logger.LogWarning("A client {Signal} batch of {Bytes} bytes was not relayed: {Reason}", signal, batch.Length, error.Value);
                return error;
            });
    }

    /// <summary>
    /// Reads the stream until it ends or <paramref name="limit" /> bytes were read, so an endless or chunked body
    /// never takes more memory than the limit.
    /// </summary>
    private static async Task<ReadOnlyMemory<byte>> ReadAtMostAsync(Stream body, int limit, CancellationToken cancellationToken)
    {
        using var buffer = new MemoryStream();
        var chunk = new byte[ReadChunkBytes];
        while (buffer.Length < limit)
        {
            var toRead = (int)Math.Min(chunk.Length, limit - buffer.Length);
            var read = await body.ReadAsync(chunk.AsMemory(0, toRead), cancellationToken);
            if (read == 0)
            {
                break;
            }

            buffer.Write(chunk, 0, read);
        }

        return buffer.ToArray();
    }
}
