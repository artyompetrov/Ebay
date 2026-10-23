using System.Net;
using AwesomeAssertions;
using Server.Adapters.Driven.OpenExchangeRates;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(OpenExchangeRatesCurrencyRateSource))]
public sealed class OpenExchangeRatesCurrencyRateSourceTests
{
    private const string LatestRatesJson = """
        {
          "disclaimer": "Usage subject to terms",
          "timestamp": 1761210000,
          "base": "USD",
          "rates": { "EUR": 0.92, "RUB": 81.5 }
        }
        """;

    [Test]
    public async Task GetLatestRatesAsync_SuccessfulAnswer_ReturnsRatesAndRequestsBaseAndSymbols()
    {
        using var handler = new StubMessageHandler(HttpStatusCode.OK, LatestRatesJson);
        var source = CreateSource(handler);

        var result = await source.GetLatestRatesAsync("USD", ["EUR", "RUB"], CancellationToken.None);

        result.TryPickT0(out var rates, out _).Should().BeTrue();
        rates.Should().BeEquivalentTo(new Dictionary<string, double> { ["EUR"] = 0.92, ["RUB"] = 81.5 });
        var request = handler.RequestUri ?? throw new AssertionException("No request was sent.");
        request.GetLeftPart(UriPartial.Path).Should().Be("https://openexchangerates.org/api/latest.json");
        request.Query.Should().Contain("base=USD").And.Contain("symbols=EUR%2CRUB").And.Contain("app_id=");
    }

    [Test]
    public async Task GetLatestRatesAsync_ErrorStatus_ReturnsError()
    {
        using var handler = new StubMessageHandler(HttpStatusCode.Unauthorized, """{ "error": true }""");
        var source = CreateSource(handler);

        var result = await source.GetLatestRatesAsync("USD", ["EUR"], CancellationToken.None);

        result.IsT1.Should().BeTrue();
        result.AsT1.Value.Should().Contain("401");
    }

    [Test]
    public async Task GetLatestRatesAsync_AnswerWithoutRates_ReturnsError()
    {
        using var handler = new StubMessageHandler(HttpStatusCode.OK, """{ "base": "USD" }""");
        var source = CreateSource(handler);

        var result = await source.GetLatestRatesAsync("USD", ["EUR"], CancellationToken.None);

        result.IsT1.Should().BeTrue();
    }

    private static OpenExchangeRatesCurrencyRateSource CreateSource(HttpMessageHandler handler) =>
        new(new SingleClientFactory(new HttpClient(handler, disposeHandler: false)));

    private sealed class StubMessageHandler : HttpMessageHandler
    {
        private readonly HttpStatusCode _statusCode;
        private readonly string _content;

        public StubMessageHandler(HttpStatusCode statusCode, string content)
        {
            _statusCode = statusCode;
            _content = content;
        }

        public Uri? RequestUri { get; private set; }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            RequestUri = request.RequestUri;
            return Task.FromResult(new HttpResponseMessage(_statusCode) { Content = new StringContent(_content) });
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
