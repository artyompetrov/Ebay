using System.Diagnostics;
using System.Net;
using System.Net.Http.Json;
using AwesomeAssertions;
using Client.Telemetry;
using Microsoft.Extensions.Logging;
using NUnit.Framework;
using Tests.Shared;

namespace Tests.Frontend.Telemetry;

[TestFixture]
[TestOf(typeof(TracingMessageHandler))]
public sealed class TracingMessageHandlerTests
{
    [Test]
    [OpenSpecScenario("client-telemetry", "Frontend backend calls are client spans that parent backend spans", "The backend server span is a child of the frontend call span")]
    public async Task BackendCall_SendsTraceParentNamingItsClientSpanInTheNavigationTrace()
    {
        using var host = new TelemetryTestHost();
        using var backend = new BackendStub();
        using var client = host.CreateTracedClient(backend);
        var navigation = host.Tracer.StartNavigation("/currencies", "Currencies")!;

        (await client.GetAsync("api/ebay/v1/currencies/")).Dispose();

        var span = host.SpansOf(navigation.TraceId).Single(static s => s.Kind == ActivityKind.Client);
        span.ParentSpanId.Should().Be(navigation.SpanId);
        span.Name.Should().Be("GET /api/ebay/v1/currencies/");
        backend.Requests.Single().Headers.GetValues("traceparent").Single()
            .Should().Be($"00-{navigation.TraceId.ToHexString()}-{span.SpanId.ToHexString()}-01");
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Frontend backend calls are client spans that parent backend spans", "A frontend call to another host carries no trace context")]
    public async Task OtherHostCall_CarriesNoTraceParent_ButIsStillASpan()
    {
        using var host = new TelemetryTestHost();
        using var otherHost = new BackendStub();
        using var client = host.CreateTracedClient(otherHost);
        var navigation = host.Tracer.StartNavigation("/", "Products")!;
        using var request = new HttpRequestMessage(HttpMethod.Get, "https://cdn.example.com/lib.js");
        request.Headers.TryAddWithoutValidation("traceparent", "00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01");

        (await client.SendAsync(request)).Dispose();

        otherHost.Requests.Single().Headers.Contains("traceparent").Should().BeFalse();
        host.SpansOf(navigation.TraceId).Should().ContainSingle(static s => s.Kind == ActivityKind.Client && s.Name == "GET /lib.js");
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Frontend backend calls are client spans that parent backend spans", "A failed frontend backend call marks its span as an error")]
    public async Task ServerError_MarksTheClientSpanAsError()
    {
        using var host = new TelemetryTestHost();
        using var backend = new BackendStub { Status = HttpStatusCode.InternalServerError };
        using var client = host.CreateTracedClient(backend);
        var navigation = host.Tracer.StartNavigation("/", "Products")!;

        (await client.GetAsync("api/ebay/v1/products/")).Dispose();

        var span = host.SpansOf(navigation.TraceId).Single(static s => s.Kind == ActivityKind.Client);
        span.Status.Should().Be(ActivityStatusCode.Error);
        span.Attributes.Should().Contain(new KeyValuePair<string, object?>("http.response.status_code", 500));
    }

    [Test]
    public async Task FailedCall_RecordsTheExceptionOnTheClientSpan()
    {
        using var host = new TelemetryTestHost();
        using var client = host.CreateTracedClient(new UnreachableBackend());
        var navigation = host.Tracer.StartNavigation("/", "Products")!;

        await client.Invoking(static c => c.GetAsync("api/ebay/v1/products/")).Should().ThrowAsync<HttpRequestException>();

        var span = host.SpansOf(navigation.TraceId).Single(static s => s.Kind == ActivityKind.Client);
        span.Status.Should().Be(ActivityStatusCode.Error);
        span.Events.Should().ContainSingle(static e => e.Name == "exception");
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Client telemetry contains no secrets or query strings", "A query string is not exported by the frontend")]
    public async Task QueryString_IsNotInAnyExportedSpanOrRecord_AtTraceLevel()
    {
        using var host = new TelemetryTestHost();
        host.Relay.MinLevel = "Trace";
        host.Level.Set(LogLevel.Trace);
        using var backend = new BackendStub { Body = new { name = "tube" } };
        using var client = host.CreateTracedClient(backend);
        var navigation = host.Tracer.StartNavigation("/", "Products")!;

        (await client.GetAsync("api/ebay/v1/products/?secretParameter=distinctive-7f3a")).Dispose();
        navigation.Stop();
        var kept = host.KeepOnly(navigation.TraceId);

        await host.Exporter.ExportAsync(CancellationToken.None);

        kept.Logs.Should().Contain(static l => l.Category == TracingMessageHandler.BodyLogCategory && l.Message.Contains("tube", StringComparison.Ordinal));
        host.Relay.Posts.Should().NotBeEmpty().And.OnlyContain(static p =>
            !p.Body.Contains("distinctive-7f3a", StringComparison.Ordinal) && !p.Body.Contains("secretParameter", StringComparison.Ordinal));
    }

    [Test]
    public async Task BodyRecords_BelongToTheClientSpanOfTheCall()
    {
        using var host = new TelemetryTestHost();
        host.Level.Set(LogLevel.Trace);
        using var backend = new BackendStub { Body = new { name = "tube" } };
        using var client = host.CreateTracedClient(backend);
        var navigation = host.Tracer.StartNavigation("/", "Products")!;

        (await client.PostAsJsonAsync("api/ebay/v1/products", new { name = "6N2P" })).Dispose();
        navigation.Stop();

        var pending = host.KeepOnly(navigation.TraceId);
        var call = pending.Spans.Single(static s => s.Kind == ActivityKind.Client);
        pending.Logs.Where(static l => l.Category == TracingMessageHandler.BodyLogCategory).Should().HaveCount(2)
            .And.OnlyContain(l => l.SpanId == call.SpanId);
    }

    private sealed class UnreachableBackend : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken) =>
            throw new HttpRequestException("The backend is unreachable.");
    }
}
