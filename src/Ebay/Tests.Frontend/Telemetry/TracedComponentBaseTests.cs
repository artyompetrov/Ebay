using System.Diagnostics;
using AwesomeAssertions;
using Bunit;
using Client.Telemetry;
using Microsoft.AspNetCore.Components;
using NUnit.Framework;
using Tests.Shared;

namespace Tests.Frontend.Telemetry;

[TestFixture]
[TestOf(typeof(TracedComponentBase))]
public sealed class TracedComponentBaseTests
{
    [Test]
    [OpenSpecScenario("client-telemetry", "Frontend component work and interop are traced", "Page initialization is a span")]
    [OpenSpecScenario("client-telemetry", "Frontend navigation is traced", "Backend calls during page initialization belong to its navigation trace")]
    public async Task PageInitialization_IsASpanUnderTheNavigation_AndItsBackendCallsAreItsChildren()
    {
        await using var context = new BunitContext();
        using var backend = new BackendStub { Body = "tube" };
        var telemetry = BunitTelemetry.Add(context, backend);
        var productId = Guid.NewGuid();
        var navigation = telemetry.Tracer.StartNavigation("/Product/{ProductId:guid}/{Tab?}", nameof(TracedTestPage))!;

        var page = context.Render<TracedTestPage>(p => p.Add(x => x.ProductId, productId));

        page.WaitForAssertion(() => page.Markup.Should().Contain("loaded"));
        telemetry.WaitForSpan(s => s.SpanId == navigation.SpanId);
        var spans = telemetry.SpansOf(navigation.TraceId);
        var initialization = spans.Single(static s => s.Name == "TracedTestPage initialize");
        initialization.ParentSpanId.Should().Be(navigation.SpanId);
        var call = spans.Single(static s => s.Kind == ActivityKind.Client);
        call.ParentSpanId.Should().Be(initialization.SpanId);
        backend.Requests.Single().Headers.GetValues("traceparent").Single().Should().Contain(navigation.TraceId.ToHexString());
    }

    [Test]
    public async Task ComponentSteps_AreExportedOnlyWhenSlow()
    {
        await using var context = new BunitContext();
        using var backend = new BackendStub();
        var telemetry = BunitTelemetry.Add(context, backend);
        var navigation = telemetry.Tracer.StartNavigation("/", "Products")!;

        var slow = context.Render<TracedTestComponent>(p => p.Add(x => x.InitializationTime, TimeSpan.FromMilliseconds(40)));
        var fast = context.Render<TracedTestComponent>(p => p.Add(x => x.InitializationTime, TimeSpan.Zero));

        var initialization = telemetry.WaitForSpan(s => s.TraceId == navigation.TraceId && s.Name == "TracedTestComponent initialize");
        fast.WaitForAssertion(() => fast.Markup.Should().Contain("component"));
        slow.WaitForAssertion(() => slow.Markup.Should().Contain("component"));

        (initialization.End - initialization.Start).Should().BeGreaterThanOrEqualTo(FrontendTracer.SlowStepThreshold);
        telemetry.SpansOf(navigation.TraceId).Should().ContainSingle(static s => s.Name == "TracedTestComponent initialize");
        await Task.CompletedTask;
    }
}
