using AwesomeAssertions;
using Bunit;
using Client.Telemetry;
using Microsoft.AspNetCore.Components;
using NUnit.Framework;
using Tests.Shared;

namespace Tests.Frontend.Telemetry;

[TestFixture]
[TestOf(typeof(NavigationTracer))]
public sealed class NavigationTracerTests
{
    private const string ProductRoute = "/Product/{ProductId:guid}/{Tab?}";

    [Test]
    [OpenSpecScenario("client-telemetry", "Frontend navigation is traced", "A navigation produces a root span named after the route")]
    public async Task Navigation_IsARootSpanNamedAfterTheRouteTemplate_EndingAfterThePageRendered()
    {
        await using var context = new BunitContext();
        using var backend = new BackendStub { Body = "tube" };
        var telemetry = BunitTelemetry.Add(context, backend);
        var productId = Guid.NewGuid();

        var view = context.Render<NavigationTracer>(p => p
            .Add(x => x.RouteData, RouteData(productId, "measurements"))
            .AddChildContent<TracedTestPage>(page => page.Add(x => x.ProductId, productId).Add(x => x.Tab, "measurements")));

        view.WaitForAssertion(() => view.Markup.Should().Contain("loaded measurements"));
        var navigation = telemetry.WaitForSpan(static s => s.Name == "nav " + ProductRoute);
        navigation.ParentSpanId.Should().BeNull();
        navigation.Attributes.Select(static a => a.Value?.ToString()).Should().NotContain(v => v != null && v.Contains(productId.ToString(), StringComparison.Ordinal));
        var spans = telemetry.SpansOf(navigation.TraceId);
        var initialization = spans.Single(static s => s.Name == "TracedTestPage initialize");
        var render = spans.Single(static s => s.Name == "TracedTestPage render");
        render.ParentSpanId.Should().Be(navigation.SpanId);
        navigation.End.Should().BeOnOrAfter(initialization.End).And.BeOnOrAfter(render.End);
        render.End.Should().BeOnOrAfter(spans.Single(static s => s.Kind == System.Diagnostics.ActivityKind.Client).End);
    }

    [Test]
    public async Task ChangedRouteValues_StartANewNavigation()
    {
        await using var context = new BunitContext();
        using var backend = new BackendStub { Body = "tube" };
        var telemetry = BunitTelemetry.Add(context, backend);
        var productId = Guid.NewGuid();
        var view = context.Render<NavigationTracer>(p => p
            .Add(x => x.RouteData, RouteData(productId, "measurements"))
            .AddChildContent<TracedTestPage>(page => page.Add(x => x.ProductId, productId).Add(x => x.Tab, "measurements")));
        view.WaitForAssertion(() => view.Markup.Should().Contain("loaded measurements"));
        var first = telemetry.WaitForSpan(static s => s.Name == "nav " + ProductRoute);

        view.Render(p => p
            .Add(x => x.RouteData, RouteData(productId, "lots"))
            .AddChildContent<TracedTestPage>(page => page.Add(x => x.ProductId, productId).Add(x => x.Tab, "lots")));

        view.WaitForAssertion(() => view.Markup.Should().Contain("loaded lots"));
        var second = telemetry.WaitForSpan(s => s.Name == "nav " + ProductRoute && s.TraceId != first.TraceId);
        telemetry.SpansOf(second.TraceId).Should().Contain(static s => s.Name == "TracedTestPage parameters set");
        await Task.CompletedTask;
    }

    private static RouteData RouteData(Guid productId, string tab) =>
        new(typeof(TracedTestPage), new Dictionary<string, object?> { ["ProductId"] = productId, ["Tab"] = tab });
}
