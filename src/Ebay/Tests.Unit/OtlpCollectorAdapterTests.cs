using System.Net;
using AwesomeAssertions;
using Server.Adapters.Driven.OtlpCollector;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(OtlpCollectorAdapter))]
public sealed class OtlpCollectorAdapterTests
{
    private static readonly Uri CollectorBase = new("http://collector.test:4318/");

    [TestCase(ClientTelemetrySignal.Traces, "http://collector.test:4318/v1/traces")]
    [TestCase(ClientTelemetrySignal.Logs, "http://collector.test:4318/v1/logs")]
    public async Task ForwardAsync_AcceptedBatch_PostsIdenticalJsonBytesToSignalPath(ClientTelemetrySignal signal, string expectedUrl)
    {
        using var handler = new RecordingHandler(static _ => new HttpResponseMessage(HttpStatusCode.OK));
        byte[] batch = [0x7B, 0x22, 0xE2, 0x82, 0xAC, 0x22, 0x7D];

        var result = await CreateAdapter(handler).ForwardAsync(signal, batch, CancellationToken.None);

        result.IsT0.Should().BeTrue();
        handler.RequestUri.Should().Be(new Uri(expectedUrl));
        handler.ContentType.Should().Be("application/json");
        handler.Body.Should().Equal(batch);
        handler.Calls.Should().Be(1);
    }

    [TestCase(HttpStatusCode.BadRequest)]
    [TestCase(HttpStatusCode.RequestEntityTooLarge)]
    public async Task ForwardAsync_CollectorClientError_ReturnsRejected(HttpStatusCode status)
    {
        using var handler = new RecordingHandler(_ => new HttpResponseMessage(status));

        var result = await CreateAdapter(handler).ForwardAsync(ClientTelemetrySignal.Logs, new byte[] { 1 }, CancellationToken.None);

        result.IsT1.Should().BeTrue();
    }

    [Test]
    public async Task ForwardAsync_CollectorServerError_ReturnsErrorWithoutRetry()
    {
        using var handler = new RecordingHandler(static _ => new HttpResponseMessage(HttpStatusCode.ServiceUnavailable));

        var result = await CreateAdapter(handler).ForwardAsync(ClientTelemetrySignal.Traces, new byte[] { 1 }, CancellationToken.None);

        result.IsT2.Should().BeTrue();
        result.AsT2.Value.Should().Contain("503");
        handler.Calls.Should().Be(1);
    }

    [Test]
    public async Task ForwardAsync_CollectorUnreachable_ReturnsError()
    {
        using var handler = new RecordingHandler(static _ => throw new HttpRequestException("Connection refused"));

        var result = await CreateAdapter(handler).ForwardAsync(ClientTelemetrySignal.Traces, new byte[] { 1 }, CancellationToken.None);

        result.IsT2.Should().BeTrue();
    }

    private static OtlpCollectorAdapter CreateAdapter(HttpMessageHandler handler) =>
        new(new SingleClientFactory(new HttpClient(handler, disposeHandler: false) { BaseAddress = CollectorBase }));

    private sealed class RecordingHandler : HttpMessageHandler
    {
        private readonly Func<HttpRequestMessage, HttpResponseMessage> _answer;

        public RecordingHandler(Func<HttpRequestMessage, HttpResponseMessage> answer)
        {
            _answer = answer;
        }

        public Uri? RequestUri { get; private set; }

        public string? ContentType { get; private set; }

        public byte[] Body { get; private set; } = [];

        public int Calls { get; private set; }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Calls++;
            RequestUri = request.RequestUri;
            ContentType = request.Content?.Headers.ContentType?.MediaType;
            Body = request.Content is null ? [] : await request.Content.ReadAsByteArrayAsync(cancellationToken);
            return _answer(request);
        }
    }

    private sealed class SingleClientFactory : IHttpClientFactory
    {
        private readonly HttpClient _client;

        public SingleClientFactory(HttpClient client)
        {
            _client = client;
        }

        public HttpClient CreateClient(string name) => _client;
    }
}
