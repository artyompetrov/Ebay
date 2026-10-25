using System.Net;
using System.Net.Http.Headers;
using OneOf;
using OneOf.Types;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.OtlpCollector;

/// <summary>
/// Sends OTLP/JSON batches of the browser clients to the collector's OTLP/HTTP receiver.
/// </summary>
internal sealed class OtlpCollectorAdapter : IClientTelemetryAdapter
{
    /// <summary>
    /// Named <see cref="HttpClient"/> of this adapter, created per call so the singleton picks up handler rotation
    /// from <see cref="IHttpClientFactory"/>.
    /// </summary>
    internal const string HttpClientName = "OtlpCollector";

    private const string TracesPath = "v1/traces";
    private const string LogsPath = "v1/logs";
    private const string JsonMediaType = "application/json";

    private readonly IHttpClientFactory _httpClientFactory;

    public OtlpCollectorAdapter(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<OneOf<Success, ClientTelemetryBatchRejected, Error<string>>> ForwardAsync(
        ClientTelemetrySignal signal,
        ReadOnlyMemory<byte> batch,
        CancellationToken cancellationToken)
    {
        using var content = new ReadOnlyMemoryContent(batch);
        content.Headers.ContentType = new MediaTypeHeaderValue(JsonMediaType);

        HttpResponseMessage response;
        try
        {
            response = await _httpClientFactory.CreateClient(HttpClientName)
                .PostAsync(PathOf(signal), content, cancellationToken);
        }
        catch (HttpRequestException exception)
        {
            return new Error<string>($"The collector is unreachable: {exception.Message}");
        }
        catch (TaskCanceledException exception) when (!cancellationToken.IsCancellationRequested)
        {
            return new Error<string>($"The collector did not answer in time: {exception.Message}");
        }

        using (response)
        {
            if (response.IsSuccessStatusCode)
            {
                return new Success();
            }

            var status = $"The collector answered {(int)response.StatusCode} ({response.StatusCode})";
            // Timeouts and backpressure are the collector's state, not a fault of the batch.
            var isBatchFault = response.StatusCode is >= HttpStatusCode.BadRequest and < HttpStatusCode.InternalServerError
                and not HttpStatusCode.RequestTimeout and not HttpStatusCode.TooManyRequests;
            return isBatchFault ? new ClientTelemetryBatchRejected(status) : new Error<string>(status);
        }
    }

    private static string PathOf(ClientTelemetrySignal signal) => signal switch
    {
        ClientTelemetrySignal.Traces => TracesPath,
        ClientTelemetrySignal.Logs => LogsPath,
        _ => throw new System.Diagnostics.UnreachableException($"Unknown telemetry signal {signal}")
    };
}
