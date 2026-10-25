using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using AwesomeAssertions;
using Server.Adapters.Driving.WebApi.Controllers;
using Tests.Shared;

namespace Tests.Integration.Tests;

[TestOf(typeof(WebApiController))]
public class ClientTelemetryRelayTests
{
    private const string TracesPath = "/api/telemetry/v1/traces";
    private const string LogsPath = "/api/telemetry/v1/logs";
    private const string SettingsPath = "/api/telemetry/v1/settings";
    private const string JsonMediaType = "application/json";
    private const int MaxBatchBytes = 1024 * 1024;

    private static FakeOtlpCollector Collector => IntegrationTestsSetupFixture.OtlpCollector;

    [Test]
    [OpenSpecScenario("client-telemetry", "Backend relays client telemetry to the collector", "A trace batch is forwarded to the collector")]
    public async Task TraceBatch_IsForwardedByteForByte()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var marker = NewMarker();
        // Unusual spacing and a non-ASCII character: a re-serialized batch would differ from the original bytes.
        var batch = Encoding.UTF8.GetBytes($$"""{ "resourceSpans" :[ ],  "marker":"{{marker}}", "note": "€" }""");

        using var response = await PostAsync(client, TracesPath, batch);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var received = Collector.ReceivedWith(marker).Should().ContainSingle().Subject;
        received.Path.Should().Be("/v1/traces");
        received.ContentType.Should().Be(JsonMediaType);
        received.Body.Should().Equal(batch);
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Backend relays client telemetry to the collector", "A log batch is forwarded to the collector")]
    public async Task LogBatch_IsForwardedByteForByte()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var marker = NewMarker();
        var batch = Encoding.UTF8.GetBytes($$"""{"resourceLogs":[],"marker":"{{marker}}"}""");

        using var response = await PostAsync(client, LogsPath, batch);

        response.StatusCode.Should().Be(HttpStatusCode.OK, await response.Content.ReadAsStringAsync());
        var received = Collector.ReceivedWith(marker).Should().ContainSingle().Subject;
        received.Path.Should().Be("/v1/logs");
        received.Body.Should().Equal(batch);
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Telemetry relay accepts only authenticated, bounded requests", "An anonymous request is rejected")]
    public async Task AnonymousRequest_IsRejectedAndNotForwarded()
    {
        using var client = IntegrationTestsSetupFixture.Factory.CreateClient();
        var marker = NewMarker();

        using var response = await PostAsync(client, TracesPath, Encoding.UTF8.GetBytes($$"""{"marker":"{{marker}}"}"""));

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        Collector.ReceivedWith(marker).Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Telemetry relay accepts only authenticated, bounded requests", "An oversized batch is rejected")]
    public async Task OversizedBatchWithDeclaredLength_IsRejectedAndNotForwarded()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var marker = NewMarker();

        using var content = new ByteArrayContent(CreateBatch(marker, MaxBatchBytes + 1));
        content.Headers.ContentType = new MediaTypeHeaderValue(JsonMediaType);
        using var response = await client.PostAsync(LogsPath, content);

        response.StatusCode.Should().Be(HttpStatusCode.RequestEntityTooLarge);
        Collector.ReceivedWith(marker).Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Telemetry relay accepts only authenticated, bounded requests", "An oversized batch is rejected")]
    public async Task OversizedChunkedBatch_IsRejectedAndNothingIsForwarded()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var marker = NewMarker();

        // A stream of unknown length is sent without Content-Length, so only reading it can reveal the size.
        using var content = new StreamContent(new UnknownLengthStream(CreateBatch(marker, MaxBatchBytes + 1)));
        content.Headers.ContentType = new MediaTypeHeaderValue(JsonMediaType);
        using var response = await client.PostAsync(LogsPath, content);

        response.StatusCode.Should().Be(HttpStatusCode.RequestEntityTooLarge);
        Collector.ReceivedWith(marker).Should().BeEmpty();
    }

    [Test]
    public async Task BatchOfExactlyTheLimit_IsForwarded()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var marker = NewMarker();

        using var response = await PostAsync(client, LogsPath, CreateBatch(marker, MaxBatchBytes));

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        Collector.ReceivedWith(marker).Should().ContainSingle();
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Telemetry relay accepts only authenticated, bounded requests", "A batch rejected by the collector is a client error")]
    public async Task BatchRejectedByCollector_IsAnsweredWithBadRequest()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var marker = NewMarker();

        using var response = await PostAsync(
            client, TracesPath, Encoding.UTF8.GetBytes($$"""{"marker":"{{marker}}","answer":"{{FakeOtlpCollector.AnswerMarker}}400"}"""));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        (await response.Content.ReadFromJsonAsync<ProblemAnswer>())!.Type.Should().Be("TelemetryProblemDetailedInfo");
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Telemetry relay accepts only authenticated, bounded requests", "A collector failure is reported once")]
    public async Task CollectorFailure_IsAnsweredWithBadGatewayAfterOneAttempt()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var marker = NewMarker();

        using var response = await PostAsync(
            client, TracesPath, Encoding.UTF8.GetBytes($$"""{"marker":"{{marker}}","answer":"{{FakeOtlpCollector.AnswerMarker}}503"}"""));

        response.StatusCode.Should().Be(HttpStatusCode.BadGateway);
        Collector.ReceivedWith(marker).Should().ContainSingle();
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Backend serves the client telemetry level", "Default level is Debug")]
    public async Task Settings_WithoutConfiguredLevel_ServeDebug()
    {
        using var client = await CreateAuthenticatedClientAsync();

        var settings = await client.GetFromJsonAsync<SettingsAnswer>(SettingsPath);

        settings!.MinLevel.Should().Be("Debug");
    }

    [Test]
    public async Task Settings_Anonymous_AreRejected()
    {
        using var client = IntegrationTestsSetupFixture.Factory.CreateClient();

        using var response = await client.GetAsync(SettingsPath);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Client errors are not stored in the database", "The old error endpoint no longer exists")]
    public async Task OldErrorEndpoint_AnswersClientError()
    {
        using var client = await CreateAuthenticatedClientAsync();

        using var response = await client.PostAsJsonAsync("/api/ebay/v1/error/", new { url = "https://www.ebay.com/itm/1", error = "boom" });

        // No API endpoint: only the frontend's GET fallback matches the path, so a POST gets 405.
        ((int)response.StatusCode).Should().BeInRange(400, 499);
    }

    private static string NewMarker() => $"relay-test-{Guid.NewGuid():N}";

    /// <summary>A JSON batch of exactly <paramref name="size"/> bytes that carries <paramref name="marker"/>.</summary>
    private static byte[] CreateBatch(string marker, int size)
    {
        var prefix = $$"""{"marker":"{{marker}}","padding":" """;
        const string Suffix = "\"}";
        return Encoding.UTF8.GetBytes(prefix + new string('x', size - prefix.Length - Suffix.Length) + Suffix);
    }

    private static async Task<HttpResponseMessage> PostAsync(HttpClient client, string path, byte[] batch)
    {
        using var content = new ByteArrayContent(batch);
        content.Headers.ContentType = new MediaTypeHeaderValue(JsonMediaType);
        return await client.PostAsync(path, content);
    }

    private static async Task<HttpClient> CreateAuthenticatedClientAsync()
    {
        var client = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(client);
        return client;
    }

    private sealed record SettingsAnswer(string MinLevel);

    private sealed record ProblemAnswer(string Type, int Status);

    private sealed class UnknownLengthStream : MemoryStream
    {
        public UnknownLengthStream(byte[] content)
            : base(content)
        {
        }

        public override bool CanSeek => false;
    }
}
