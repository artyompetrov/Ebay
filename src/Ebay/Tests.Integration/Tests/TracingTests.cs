using System.Diagnostics;
using System.Net;
using System.Net.Http.Json;
using System.Net.Sockets;
using System.Text;
using AwesomeAssertions;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using Server.Platform;
using Tests.Shared;

namespace Tests.Integration.Tests;

[TestOf(typeof(PlatformExtensions))]
public class TracingTests
{
    private const string SpecId = "observability-tracing";
    private const string TraceParentHeader = "traceparent";
    private const string ProductsPath = "/api/ebay/v1/products";
    private const string ProductsRoute = "ebay/v1/products";
    private const string TracedControlPath = "/chrome_extensions/auth";
    private const string AspNetCoreSourceName = "Microsoft.AspNetCore";
    private const string DatabaseSourceName = "Npgsql";
    private const string HttpClientSourceName = "System.Net.Http";
    private const string LoopbackAddress = "127.0.0.1";

    // Our own test source: its name starts with "Server.", so the platform exports it like an application source.
    private static readonly ActivitySource TestSource = new("Server.Tests.Integration.Tracing");

    private static SpanCollector Spans => IntegrationTestsSetupFixture.SpanCollector;

    [Test]
    [OpenSpecScenario(SpecId, "Incoming API requests are traced", "An API request produces a server span")]
    public async Task ApiRequest_ProducesServerSpanWithMethodRouteAndStatus()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var traceId = ActivityTraceId.CreateRandom();

        using var response = await SendAsync(client, HttpMethod.Get, ProductsPath, traceId, sampled: true);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            var serverSpan = Spans.SpansOf(traceId).Should().ContainSingle(span => IsServerSpan(span)).Subject;
            serverSpan.GetTagItem("http.request.method").Should().Be("GET");
            serverSpan.GetTagItem("http.route").Should().BeOfType<string>().Which.Should().Contain(ProductsRoute);
            serverSpan.GetTagItem("http.response.status_code").Should().Be((int)HttpStatusCode.OK);
            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario(SpecId, "Incoming API requests are traced", "A request marked as not sampled is still recorded")]
    public async Task RequestWithSampledFlagOff_IsStillRecorded()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var traceId = ActivityTraceId.CreateRandom();

        using var response = await SendAsync(client, HttpMethod.Get, ProductsPath, traceId, sampled: false);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            Spans.SpansOf(traceId).Should().ContainSingle(span => IsServerSpan(span));
            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario(SpecId, "Infrastructure and static requests are not traced", "Health check is not traced")]
    public Task HealthCheck_IsNotTraced() => AssertNotTracedAsync(PlatformExtensions.HealthEndpointPath);

    [Test]
    [OpenSpecScenario(SpecId, "Infrastructure and static requests are not traced", "Static frontend file is not traced")]
    public Task FrameworkFile_IsNotTraced() => AssertNotTracedAsync("/_framework/blazor.webassembly.js");

    [Test]
    [OpenSpecScenario(SpecId, "Infrastructure and static requests are not traced", "Static asset by extension is not traced")]
    public Task Favicon_IsNotTraced() => AssertNotTracedAsync("/favicon.ico");

    [Test]
    [OpenSpecScenario(SpecId, "Infrastructure and static requests are not traced", "Well-known path is not traced")]
    public Task WellKnownPath_IsNotTraced() => AssertNotTracedAsync("/.well-known/openid-configuration");

    [Test]
    [OpenSpecScenario(SpecId, "Database commands are traced inside their request", "A request that reads the database has a nested database span")]
    public async Task RequestReadingDatabase_HasDatabaseSpanUnderServerSpan()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var traceId = ActivityTraceId.CreateRandom();

        using var response = await SendAsync(client, HttpMethod.Get, ProductsPath, traceId, sampled: true);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            var trace = Spans.SpansOf(traceId);
            var serverSpan = trace.Should().ContainSingle(span => IsServerSpan(span)).Subject;
            trace.Where(IsDatabaseSpan).Should().Contain(span => HasAncestor(span, serverSpan, trace));
            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario(SpecId, "Database commands are traced inside their request", "Database spans contain no parameter values")]
    public async Task DatabaseSpans_DoNotContainParameterValues()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var traceId = ActivityTraceId.CreateRandom();
        var productName = $"tracing-parameter-{Guid.NewGuid():N}";

        using var request = CreateRequest(HttpMethod.Post, ProductsPath, traceId, sampled: true);
        request.Content = JsonContent.Create(new
        {
            name = productName,
            weight = 100,
            searchQueries = new[] { new { id = Guid.NewGuid(), query = "tracing product" } },
            ruSearchQueries = Array.Empty<object>()
        });
        using var response = await client.SendAsync(request);
        response.IsSuccessStatusCode.Should().BeTrue();

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            var trace = Spans.SpansOf(traceId);
            trace.Should().Contain(span => IsServerSpan(span), "the request has finished and been exported");
            var databaseSpans = trace.Where(IsDatabaseSpan).ToArray();
            databaseSpans.Should().NotBeEmpty();
            databaseSpans.Should().AllSatisfy(span => TagValues(span).Should().NotContain(value => value.Contains(productName)));
            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario(SpecId, "Database commands outside any span are not recorded", "A database command without a parent span is dropped")]
    public async Task DatabaseCommandWithoutParentSpan_IsDropped()
    {
        var orphanMarker = $"orphan_{Guid.NewGuid():N}";
        var parentedMarker = $"parented_{Guid.NewGuid():N}";

        Activity.Current = null;
        await ExecuteMarkerQueryAsync(orphanMarker);

        // A command inside a span is exported; once it shows up, the earlier orphan command would have been too.
        using (TestSource.StartActivity("parent-of-database-command"))
        {
            await ExecuteMarkerQueryAsync(parentedMarker);
        }

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            Spans.SpansWhere(span => IsDatabaseSpan(span) && TagValues(span).Any(value => value.Contains(parentedMarker)))
                .Should().NotBeEmpty();
            return Task.CompletedTask;
        });
        Spans.SpansWhere(span => TagValues(span).Any(value => value.Contains(orphanMarker))).Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario(SpecId, "Outgoing HTTP calls are traced", "An outgoing call produces a client span")]
    public async Task OutgoingCall_ProducesClientSpanUnderActiveSpan()
    {
        using var stub = new LoopbackHttpStub();
        var serveTask = stub.ServeOneRequestAsync();
        var httpClientFactory = IntegrationTestsSetupFixture.Factory.Services.GetRequiredService<IHttpClientFactory>();
        using var httpClient = httpClientFactory.CreateClient();

        ActivityTraceId traceId;
        ActivitySpanId parentSpanId;
        using (var parent = TestSource.StartActivity("parent-of-outgoing-call")
                   ?? throw new InvalidOperationException("The platform exports Server.* sources, so the activity must be created."))
        {
            traceId = parent.TraceId;
            parentSpanId = parent.SpanId;
            using var response = await httpClient.GetAsync($"http://{LoopbackAddress}:{stub.Port}/outgoing");
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        await serveTask;

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            var clientSpan = Spans.SpansOf(traceId)
                .Should().ContainSingle(span => span.Source.Name == HttpClientSourceName && span.Kind == ActivityKind.Client)
                .Subject;
            clientSpan.ParentSpanId.Should().Be(parentSpanId);
            clientSpan.GetTagItem("http.request.method").Should().Be("GET");
            clientSpan.GetTagItem("server.address").Should().Be(LoopbackAddress);
            clientSpan.GetTagItem("http.response.status_code").Should().Be((int)HttpStatusCode.OK);
            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario(SpecId, "Application spans are exported", "Spans from every application source are recorded")]
    public async Task SpansFromEveryApplicationSource_AreRecorded()
    {
        string[] sourceNames = ["Server.Adapters.Driven.ChipFind", "Server.Adapters.Driven.Qrz", "Server.Application.SaleAdvertisements"];
        var operationNames = new Dictionary<string, string>();

        foreach (var sourceName in sourceNames)
        {
            using var source = new ActivitySource(sourceName);
            var operationName = $"tracing-test-{Guid.NewGuid():N}";
            operationNames[sourceName] = operationName;
            source.StartActivity(operationName)?.Dispose();
        }

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            foreach (var (sourceName, operationName) in operationNames)
            {
                Spans.SpansWhere(span => span.OperationName == operationName)
                    .Should().ContainSingle(span => span.Source.Name == sourceName);
            }

            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario(SpecId, "Traces contain no credentials or query strings", "Query string and authorization header are not recorded")]
    public async Task QueryStringAndAuthorizationHeader_AreNotRecorded()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var token = client.DefaultRequestHeaders.Authorization?.Parameter
            ?? throw new InvalidOperationException("The client was just authenticated.");
        var traceId = ActivityTraceId.CreateRandom();
        const string queryParameterName = "tracingQueryMarker";
        var queryValue = Guid.NewGuid().ToString("N");

        using var response = await SendAsync(
            client, HttpMethod.Get, $"{ProductsPath}?{queryParameterName}={queryValue}", traceId, sampled: true);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            var trace = Spans.SpansOf(traceId);
            trace.Should().Contain(span => IsServerSpan(span));
            trace.SelectMany(TagValues).Should().NotContain(value =>
                value.Contains(queryValue) || value.Contains(queryParameterName) || value.Contains(token));
            return Task.CompletedTask;
        });
    }

    private static async Task AssertNotTracedAsync(string path)
    {
        using var client = IntegrationTestsSetupFixture.Factory.CreateClient();
        var excludedTraceId = ActivityTraceId.CreateRandom();
        var controlTraceId = ActivityTraceId.CreateRandom();

        using (await SendAsync(client, HttpMethod.Get, path, excludedTraceId, sampled: true))
        {
        }

        // A traced request sent afterwards; once its span is exported, a span of the excluded request would be too.
        using (await SendAsync(client, HttpMethod.Get, TracedControlPath, controlTraceId, sampled: true))
        {
        }

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            Spans.SpansOf(controlTraceId).Should().Contain(span => IsServerSpan(span));
            return Task.CompletedTask;
        });
        Spans.SpansOf(excludedTraceId).Should().BeEmpty();
    }

    private static async Task<HttpClient> CreateAuthenticatedClientAsync()
    {
        var client = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(client);
        return client;
    }

    private static async Task<HttpResponseMessage> SendAsync(
        HttpClient client, HttpMethod method, string path, ActivityTraceId traceId, bool sampled)
    {
        using var request = CreateRequest(method, path, traceId, sampled);
        return await client.SendAsync(request);
    }

    private static HttpRequestMessage CreateRequest(HttpMethod method, string path, ActivityTraceId traceId, bool sampled)
    {
        var request = new HttpRequestMessage(method, path);
        request.Headers.Add(TraceParentHeader, SpanCollector.CreateTraceParent(traceId, sampled));
        return request;
    }

    private static async Task ExecuteMarkerQueryAsync(string marker)
    {
        await using var connection = new NpgsqlConnection(IntegrationTestsSetupFixture.DatabaseConnectionString);
        await connection.OpenAsync();
        await using var command = new NpgsqlCommand($"SELECT '{marker}'", connection);
        await command.ExecuteScalarAsync();
    }

    private static bool IsServerSpan(Activity span) =>
        span.Source.Name == AspNetCoreSourceName && span.Kind == ActivityKind.Server;

    private static bool IsDatabaseSpan(Activity span) => span.Source.Name == DatabaseSourceName;

    private static bool HasAncestor(Activity span, Activity ancestor, IReadOnlyCollection<Activity> trace)
    {
        var current = span;
        while (current.ParentSpanId != default)
        {
            if (current.ParentSpanId == ancestor.SpanId)
            {
                return true;
            }

            var parent = trace.FirstOrDefault(candidate => candidate.SpanId == current.ParentSpanId);
            if (parent is null)
            {
                return false;
            }

            current = parent;
        }

        return false;
    }

    private static IEnumerable<string> TagValues(Activity span) =>
        span.TagObjects.Select(static tag => tag.Value?.ToString() ?? string.Empty);

    /// <summary>
    /// A plain socket HTTP server on the loopback interface. Unlike TestServer, calls to it go through the real
    /// HTTP handler pipeline, so the client span is created just as in production.
    /// </summary>
    private sealed class LoopbackHttpStub : IDisposable
    {
        private const string Response = "HTTP/1.1 200 OK\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";
        private const int RequestBufferSize = 4096;

        private readonly TcpListener _listener = new(IPAddress.Loopback, port: 0);

        public LoopbackHttpStub() => _listener.Start();

        public int Port => ((IPEndPoint)_listener.LocalEndpoint).Port;

        public async Task ServeOneRequestAsync()
        {
            using var socket = await _listener.AcceptSocketAsync();
            var buffer = new byte[RequestBufferSize];
            await socket.ReceiveAsync(buffer, SocketFlags.None);
            await socket.SendAsync(Encoding.ASCII.GetBytes(Response), SocketFlags.None);
        }

        public void Dispose() => _listener.Stop();
    }
}
