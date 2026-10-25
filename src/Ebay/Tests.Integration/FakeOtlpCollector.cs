using System.Collections.Concurrent;
using System.Net;
using System.Text;

namespace Tests.Integration;

/// <summary>
/// Stands in for the OpenTelemetry collector behind the client telemetry relay: the relay's named HttpClient gets
/// <see cref="CreateHandler"/> as its primary handler, so the backend's own OTLP exporters are not affected.
/// Tests mark their batch with a unique value and read back only the requests that carry it; a batch containing
/// <see cref="AnswerMarker"/> followed by a status code gets that status code as the answer.
/// </summary>
public sealed class FakeOtlpCollector
{
    public const string AnswerMarker = "fake-collector-answer-";

    private const int StatusCodeLength = 3;

    private readonly ConcurrentQueue<ReceivedBatch> _received = new();

    public HttpMessageHandler CreateHandler() => new Handler(this);

    /// <summary>Batches received so far whose body contains <paramref name="marker"/>.</summary>
    public ReceivedBatch[] ReceivedWith(string marker) =>
        [.. _received.Where(batch => Encoding.UTF8.GetString(batch.Body).Contains(marker, StringComparison.Ordinal))];

    private static HttpStatusCode AnswerFor(string body)
    {
        var index = body.IndexOf(AnswerMarker, StringComparison.Ordinal);
        return index < 0
            ? HttpStatusCode.OK
            : (HttpStatusCode)int.Parse(body.AsSpan(index + AnswerMarker.Length, StatusCodeLength), provider: null);
    }

    public sealed record ReceivedBatch(string Path, string? ContentType, byte[] Body);

    private sealed class Handler : HttpMessageHandler
    {
        private readonly FakeOtlpCollector _collector;

        public Handler(FakeOtlpCollector collector)
        {
            _collector = collector;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var body = request.Content is null ? [] : await request.Content.ReadAsByteArrayAsync(cancellationToken);
            _collector._received.Enqueue(new ReceivedBatch(
                request.RequestUri?.AbsolutePath ?? string.Empty,
                request.Content?.Headers.ContentType?.MediaType,
                body));
            return new HttpResponseMessage(AnswerFor(Encoding.UTF8.GetString(body)));
        }
    }
}
