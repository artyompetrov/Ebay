using System.Diagnostics;
using AwesomeAssertions;
using Client.Telemetry;
using NUnit.Framework;
using Tests.Shared;

namespace Tests.Frontend.Telemetry;

[TestFixture]
[TestOf(typeof(FrontendTracer))]
public sealed class FrontendTracerTests
{
    [Test]
    [OpenSpecScenario("client-telemetry", "Frontend component work and interop are traced", "A JS interop call is a span")]
    public void InteropCall_IsASpanNamedAfterTheFunction_InTheCurrentTrace()
    {
        using var host = new TelemetryTestHost();
        var navigation = host.Tracer.StartNavigation("/Product/{ProductId:guid}/{Tab?}", "Product")!;

        var html = host.Tracer.TraceInterop("GetProductDescriptionEditorHtml", static () => "<p>text</p>");

        html.Should().Be("<p>text</p>");
        var span = host.SpansOf(navigation.TraceId).Single();
        span.Name.Should().Contain("GetProductDescriptionEditorHtml");
        span.ParentSpanId.Should().Be(navigation.SpanId);
    }

    [Test]
    public void FailingInteropCall_MarksItsSpanAsError()
    {
        using var host = new TelemetryTestHost();
        var navigation = host.Tracer.StartNavigation("/", "Products")!;

        host.Tracer.Invoking(static t => t.TraceInterop("SetFocusByElementId", static () => throw new InvalidOperationException("no element")))
            .Should().Throw<InvalidOperationException>();

        host.SpansOf(navigation.TraceId).Single().Status.Should().Be(ActivityStatusCode.Error);
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Frontend component work and interop are traced", "A click is a root span of its own interaction")]
    public async Task Click_IsARootSpan_AndTheBackendCallsOfItsHandlerAreItsChildren()
    {
        using var host = new TelemetryTestHost();
        using var backend = new BackendStub();
        using var client = host.CreateTracedClient(backend);
        var navigation = host.Tracer.StartNavigation("/", "Products")!;
        host.Tracer.CompleteNavigation(navigation);

        host.Browser.Click("recalculate-prices", host.Time.GetUtcNow());
        (await client.PostAsync("api/ebay/v1/calculate_prices_for_all/", null)).Dispose();
        host.Time.Advance(FrontendTracer.InteractionWindow * 2);
        host.Tracer.PullInteractions();

        var sentTraceParent = backend.Requests.Single().Headers.GetValues("traceparent").Single();
        var spans = host.Buffer.Drain().Spans;
        var call = spans.Single(s => s.Kind == ActivityKind.Client && sentTraceParent.Contains(s.SpanId.ToHexString(), StringComparison.Ordinal));
        var click = spans.Single(s => s.TraceId == call.TraceId && s.Name == "click recalculate-prices");
        click.ParentSpanId.Should().BeNull();
        click.TraceId.Should().NotBe(navigation.TraceId);
        call.ParentSpanId.Should().Be(click.SpanId);
        click.End.Should().BeOnOrAfter(call.End);
        click.Attributes.Select(static a => a.Key).Should().Equal("frontend.click.target");
    }
}
