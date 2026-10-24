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
    private const string TraceParentHeader = "traceparent";
    private const string ProductsPath = "/api/ebay/v1/products";
    private const string ProductsRoute = "ebay/v1/products";
    private const string TracedControlPath = "/chrome_extensions/auth";
    private const string AspNetCoreSourceName = "Microsoft.AspNetCore";
    private const string DatabaseSourceName = "Npgsql";
    private const string HttpClientSourceName = "System.Net.Http";
    private const string EmailClientSourceName = "MailKit.Net.SmtpClient";
    private const string ExceptionEventName = "exception";
    private const string ExceptionTypeTag = "exception.type";
    private const string LoopbackAddress = "127.0.0.1";
    private const int GracePeriodChecks = 4;
    private static readonly TimeSpan GracePeriodCheckInterval = TimeSpan.FromMilliseconds(250);

    // Our own test source: its name starts with "Server.", so the platform exports it like an application source.
    private static readonly ActivitySource TestSource = new("Server.Tests.Integration.Tracing");

    private static SpanCollector Spans => IntegrationTestsSetupFixture.SpanCollector;

    [Test]
    [OpenSpecScenario("observability-tracing", "Incoming API requests are traced", "An API request produces a server span")]
    public async Task ApiRequest_ProducesServerSpanWithMethodRouteAndStatus()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var traceId = ActivityTraceId.CreateRandom();

        using var response = await SendAsync(client, HttpMethod.Get, ProductsPath, traceId, sampled: true);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            var serverSpan = Spans.SpansOf(traceId).Should().ContainSingle(static span => IsServerSpan(span)).Subject;
            serverSpan.GetTagItem("http.request.method").Should().Be("GET");
            serverSpan.GetTagItem("http.route").Should().BeOfType<string>().Which.Should().Contain(ProductsRoute);
            serverSpan.GetTagItem("http.response.status_code").Should().Be((int)HttpStatusCode.OK);
            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario("observability-tracing", "Incoming API requests are traced", "A request marked as not sampled is still recorded")]
    public async Task RequestWithSampledFlagOff_IsStillRecorded()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var traceId = ActivityTraceId.CreateRandom();

        using var response = await SendAsync(client, HttpMethod.Get, ProductsPath, traceId, sampled: false);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            Spans.SpansOf(traceId).Should().ContainSingle(static span => IsServerSpan(span));
            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario("observability-tracing", "Infrastructure and static requests are not traced", "Health check is not traced")]
    public Task HealthCheck_IsNotTraced() => AssertNotTracedAsync(PlatformExtensions.HealthEndpointPath);

    [Test]
    [OpenSpecScenario("observability-tracing", "Infrastructure and static requests are not traced", "Static frontend file is not traced")]
    public Task FrameworkFile_IsNotTraced() => AssertNotTracedAsync("/_framework/blazor.webassembly.js");

    [Test]
    [OpenSpecScenario("observability-tracing", "Infrastructure and static requests are not traced", "Static asset by extension is not traced")]
    public Task Favicon_IsNotTraced() => AssertNotTracedAsync("/favicon.ico");

    [Test]
    [OpenSpecScenario("observability-tracing", "Infrastructure and static requests are not traced", "Well-known path is not traced")]
    public Task WellKnownPath_IsNotTraced() => AssertNotTracedAsync("/.well-known/openid-configuration");

    [Test]
    [OpenSpecScenario("observability-tracing", "Database commands are traced inside their request", "A request that reads the database has a nested database span")]
    public async Task RequestReadingDatabase_HasDatabaseSpanUnderServerSpan()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var traceId = ActivityTraceId.CreateRandom();

        using var response = await SendAsync(client, HttpMethod.Get, ProductsPath, traceId, sampled: true);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            var trace = Spans.SpansOf(traceId);
            var serverSpan = trace.Should().ContainSingle(static span => IsServerSpan(span)).Subject;
            trace.Where(IsDatabaseSpan).Should().Contain(span => HasAncestor(span, serverSpan, trace));
            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario("observability-tracing", "Database commands are traced inside their request", "Database spans contain no parameter values")]
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
            trace.Should().Contain(static span => IsServerSpan(span), "the request has finished and been exported");
            var databaseSpans = trace.Where(IsDatabaseSpan).ToArray();
            databaseSpans.Should().NotBeEmpty();
            databaseSpans.Should().AllSatisfy(span => SpanTexts(span).Should().NotContain(value => value.Contains(productName)));
            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario("observability-tracing", "Database commands outside any span are not recorded", "A database command without a parent span is dropped")]
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
            Spans.SpansWhere(span => IsDatabaseSpan(span) && SpanTexts(span).Any(value => value.Contains(parentedMarker)))
                .Should().NotBeEmpty();
            return Task.CompletedTask;
        });
        await AssertStaysEmptyAsync(() => Spans.SpansWhere(span => SpanTexts(span).Any(value => value.Contains(orphanMarker))));
    }

    [Test]
    [OpenSpecScenario("observability-tracing", "Outgoing HTTP calls are traced", "An outgoing call produces a client span")]
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
                .Should().ContainSingle(static span => span.Source.Name == HttpClientSourceName && span.Kind == ActivityKind.Client)
                .Subject;
            clientSpan.ParentSpanId.Should().Be(parentSpanId);
            clientSpan.GetTagItem("http.request.method").Should().Be("GET");
            clientSpan.GetTagItem("server.address").Should().Be(LoopbackAddress);
            clientSpan.GetTagItem("http.response.status_code").Should().Be((int)HttpStatusCode.OK);
            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario("observability-tracing", "Failed spans carry their exception", "A failed outgoing call records its exception")]
    public async Task FailedOutgoingCall_RecordsExceptionOnClientSpan()
    {
        var closedPort = GetClosedLoopbackPort();
        var httpClientFactory = IntegrationTestsSetupFixture.Factory.Services.GetRequiredService<IHttpClientFactory>();
        using var httpClient = httpClientFactory.CreateClient();

        ActivityTraceId traceId;
        using (var parent = TestSource.StartActivity("parent-of-failed-outgoing-call")
                   ?? throw new InvalidOperationException("The platform exports Server.* sources, so the activity must be created."))
        {
            traceId = parent.TraceId;
            var call = () => httpClient.GetAsync($"http://{LoopbackAddress}:{closedPort}/refused");
            await call.Should().ThrowAsync<HttpRequestException>();
        }

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            var clientSpan = Spans.SpansOf(traceId)
                .Should().ContainSingle(static span => span.Source.Name == HttpClientSourceName && span.Kind == ActivityKind.Client)
                .Subject;
            clientSpan.Status.Should().Be(ActivityStatusCode.Error);
            clientSpan.Events.Should().Contain(static spanEvent =>
                spanEvent.Name == ExceptionEventName && spanEvent.Tags.Any(static tag => tag.Key == ExceptionTypeTag));
            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario("observability-tracing", "Email sending is traced", "A failed connection to the mail server is recorded")]
    public async Task FailedConnectionToMailServer_IsRecordedUnderActiveSpan()
    {
        var closedPort = GetClosedLoopbackPort();

        ActivityTraceId traceId;
        Activity parentSpan;
        using (var parent = TestSource.StartActivity("parent-of-email")
                   ?? throw new InvalidOperationException("The platform exports Server.* sources, so the activity must be created."))
        {
            traceId = parent.TraceId;
            parentSpan = parent;
            using var smtpClient = new MailKit.Net.Smtp.SmtpClient();
            var connect = () => smtpClient.ConnectAsync(LoopbackAddress, closedPort, MailKit.Security.SecureSocketOptions.None);
            await connect.Should().ThrowAsync<Exception>();
        }

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            var trace = Spans.SpansOf(traceId);
            var emailSpans = trace.Where(static span => span.Source.Name == EmailClientSourceName).ToArray();
            emailSpans.Should().NotBeEmpty();
            emailSpans.Should().AllSatisfy(span => HasAncestor(span, parentSpan, trace).Should().BeTrue());
            emailSpans.Should().Contain(static span => span.Status == ActivityStatusCode.Error);
            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario("observability-tracing", "Application spans are exported", "Spans from every application source are recorded")]
    public async Task SpansFromEveryApplicationSource_AreRecorded()
    {
        string[] sourceNames = ["Server.Adapters.Driven.ChipFind", "Server.Adapters.Driven.Qrz", "Server.Adapters.Driven.NewAudioPortal", "Server.Application.SaleAdvertisements"];
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
    [OpenSpecScenario("observability-tracing", "Traces contain no credentials or query strings", "Query string and authorization header are not recorded")]
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
            trace.Should().Contain(static span => IsServerSpan(span));
            trace.SelectMany(SpanTexts).Should().NotContain(value =>
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
            Spans.SpansOf(controlTraceId).Should().Contain(static span => IsServerSpan(span));
            return Task.CompletedTask;
        });
        await AssertStaysEmptyAsync(() => Spans.SpansOf(excludedTraceId));
    }

    /// <summary>
    /// The control span only shows that export has caught up; the host may still end the earlier request's span
    /// a moment after its response. Keep checking for a short grace period so a late span is not missed.
    /// </summary>
    private static async Task AssertStaysEmptyAsync(Func<Activity[]> spans)
    {
        for (var check = 0; check < GracePeriodChecks; check++)
        {
            spans().Should().BeEmpty();
            await Task.Delay(GracePeriodCheckInterval);
        }

        spans().Should().BeEmpty();
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

    /// <summary>A loopback port nothing listens on: connections to it are refused right away.</summary>
    private static int GetClosedLoopbackPort()
    {
        var listener = new TcpListener(IPAddress.Loopback, port: 0);
        listener.Start();
        var port = ((IPEndPoint)listener.LocalEndpoint).Port;
        listener.Stop();
        return port;
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

    /// <summary>Every piece of text a span carries to the trace store: names, status, tags and event tags.</summary>
    private static IEnumerable<string> SpanTexts(Activity span) =>
        new[] { span.DisplayName, span.OperationName, span.StatusDescription ?? string.Empty }
            .Concat(span.TagObjects.Select(static tag => tag.Value?.ToString() ?? string.Empty))
            .Concat(span.Events.SelectMany(static spanEvent =>
                spanEvent.Tags.Select(static tag => tag.Value?.ToString() ?? string.Empty).Prepend(spanEvent.Name)));

    /// <summary>
    /// A plain socket HTTP server on the loopback interface. Unlike TestServer, calls to it go through the real
    /// HTTP handler pipeline, so the client span is created just as in production.
    /// </summary>
    private sealed class LoopbackHttpStub : IDisposable
    {
        private const string Response = "HTTP/1.1 200 OK\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";
        private const string EndOfHeaders = "\r\n\r\n";
        private const int RequestBufferSize = 4096;
        private static readonly TimeSpan RequestTimeout = TimeSpan.FromSeconds(10);

        private readonly TcpListener _listener = new(IPAddress.Loopback, port: 0);

        public LoopbackHttpStub() => _listener.Start();

        public int Port => ((IPEndPoint)_listener.LocalEndpoint).Port;

        public async Task ServeOneRequestAsync()
        {
            using var timeout = new CancellationTokenSource(RequestTimeout);
            using var socket = await _listener.AcceptSocketAsync(timeout.Token);

            // Read the whole request head (a GET has no body) before answering: closing a socket with unread
            // data resets the connection instead of finishing the response.
            var request = new StringBuilder();
            var buffer = new byte[RequestBufferSize];
            while (!request.ToString().Contains(EndOfHeaders, StringComparison.Ordinal))
            {
                var received = await socket.ReceiveAsync(buffer, SocketFlags.None, timeout.Token);
                if (received == 0)
                {
                    throw new InvalidOperationException("The client closed the connection before sending the request.");
                }

                request.Append(Encoding.ASCII.GetString(buffer, 0, received));
            }

            await socket.SendAsync(Encoding.ASCII.GetBytes(Response), SocketFlags.None, timeout.Token);
            socket.Shutdown(SocketShutdown.Send);
        }

        public void Dispose() => _listener.Stop();
    }
}
