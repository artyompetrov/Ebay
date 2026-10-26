using System.Diagnostics;
using System.Net;
using System.Reflection;
using AwesomeAssertions;
using Client.Telemetry;
using Microsoft.Extensions.Logging;
using NUnit.Framework;
using Tests.Shared;

namespace Tests.Frontend.Telemetry;

[TestFixture]
[TestOf(typeof(TelemetryExporter))]
public sealed class TelemetryExporterTests
{
    [Test]
    [OpenSpecScenario("client-telemetry", "Clients identify themselves in telemetry", "Frontend telemetry carries its identity")]
    public async Task ExportedSpanAndLog_CarryServiceNameVersionAndTheSameSession()
    {
        using var host = new TelemetryTestHost();
        host.Buffer.Add(Span("identity span"));
        host.Buffer.Add(Log(LogLevel.Warning, "identity record"));

        await host.Exporter.ExportAsync(CancellationToken.None);

        var span = OtlpJson.Spans(host.Relay.Posts.Single(static p => p.Signal == "traces").Body).Single();
        var log = OtlpJson.Logs(host.Relay.Posts.Single(static p => p.Signal == "logs").Body).Single();
        var version = typeof(TelemetryExporter).Assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>()!.InformationalVersion;
        foreach (var resource in new[] { span.Resource, log.Resource })
        {
            resource["service.name"].Should().Be("ebay_frontend");
            resource["service.version"].Should().Be(version);
        }

        span.Resource["session.id"].Should().NotBeEmpty().And.Be(log.Resource["session.id"]);
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Telemetry export never disturbs the client", "Frontend export without a token does not start a login")]
    public async Task WithoutToken_BatchIsDropped_AndNoLoginStarts()
    {
        using var host = new TelemetryTestHost();
        host.Tokens.HasToken = false;
        host.Buffer.Add(Span("no token"));

        await host.Exporter.ExportAsync(CancellationToken.None);

        host.Relay.Posts.Should().BeEmpty();
        host.Navigation.Navigations.Should().BeEmpty();
        host.Buffer.TakeDroppedCounts().Should().Be((1, 0));
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Telemetry export never disturbs the client", "A failed frontend export is dropped and counted")]
    public async Task FailedExport_IsNotResent_AndTheNextExportReportsTheDroppedCount()
    {
        using var host = new TelemetryTestHost();
        host.Relay.AnswerNext(HttpStatusCode.BadGateway);
        host.Buffer.Add(Span("lost 1"));
        host.Buffer.Add(Span("lost 2"));
        await host.Exporter.ExportAsync(CancellationToken.None);

        host.Buffer.Add(Span("delivered"));
        await host.Exporter.ExportAsync(CancellationToken.None);

        var traces = host.Relay.Posts.Where(static p => p.Signal == "traces").ToArray();
        traces.Should().HaveCount(2);
        OtlpJson.Spans(traces[1].Body).Select(static s => s.Name).Should().Equal("delivered");
        var report = host.Relay.Posts.Where(static p => p.Signal == "logs").SelectMany(static p => OtlpJson.Logs(p.Body)).Single();
        report.Attributes["telemetry.dropped_spans"].Should().Be("2");
        report.Attributes["telemetry.dropped_logs"].Should().Be("0");
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Telemetry export never disturbs the client", "Frontend export calls carry no trace context")]
    public async Task ExportCalls_CarryNoTraceParent_EvenInsideASpan()
    {
        using var host = new TelemetryTestHost();
        host.Buffer.Add(Span("inside a span"));
        host.Buffer.Add(Log(LogLevel.Information, "inside a span"));
        using var current = new Activity("caller").SetIdFormat(ActivityIdFormat.W3C).Start();

        await host.Exporter.ExportAsync(CancellationToken.None);

        host.Relay.Posts.Should().HaveCount(2).And.OnlyContain(static p => !p.HasTraceParent);
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Telemetry export never disturbs the client", "Large frontend batches are split")]
    public async Task MoreThanOneMebibyte_IsPostedInSeveralBatchesBelowIt()
    {
        using var host = new TelemetryTestHost();
        var largeValue = new string('x', OtlpJsonSerializer.MaxValueLength);
        const int spanCount = 400;
        for (var i = 0; i < spanCount; i++)
        {
            host.Buffer.Add(Span("large " + i, [new("payload", largeValue)]));
        }

        await host.Exporter.ExportAsync(CancellationToken.None);

        var posts = host.Relay.Posts.Where(static p => p.Signal == "traces").ToArray();
        posts.Length.Should().BeGreaterThan(1);
        posts.Should().OnlyContain(static p => System.Text.Encoding.UTF8.GetByteCount(p.Body) < 1024 * 1024);
        posts.SelectMany(static p => OtlpJson.Spans(p.Body)).Should().HaveCount(spanCount);
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Pending telemetry leaves the page when it is hidden", "Frontend records are exported when the tab is hidden")]
    public async Task FlushRequest_ExportsWithoutWaitingForTheInterval()
    {
        // The manual clock never ticks, so only the flush can start an export.
        using var host = new TelemetryTestHost();
        using var stop = new CancellationTokenSource();
        var loop = host.Exporter.RunAsync(stop.Token);
        host.Buffer.Add(Span("pending when hidden"));

        host.Exporter.RequestFlush();

        var deadline = DateTimeOffset.UtcNow.AddSeconds(10);
        while (host.Relay.Posts.Count == 0 && DateTimeOffset.UtcNow < deadline)
        {
            await Task.Delay(10);
        }

        await stop.CancelAsync();
        await loop.Invoking(static l => l).Should().ThrowAsync<OperationCanceledException>();
        OtlpJson.Spans(host.Relay.Posts.Single().Body).Select(static s => s.Name).Should().Equal("pending when hidden");
    }

    private static SpanData Span(string name, IReadOnlyList<KeyValuePair<string, object?>>? attributes = null)
    {
        var now = DateTimeOffset.UtcNow;
        return new SpanData(name, ActivityTraceId.CreateRandom(), ActivitySpanId.CreateRandom(), null, ActivityKind.Internal,
            now, now.AddMilliseconds(1), ActivityStatusCode.Unset, null, attributes ?? [], [], []);
    }

    private static LogData Log(LogLevel level, string message) =>
        new(DateTimeOffset.UtcNow, level, "Tests", message, null, null, []);
}
