using AwesomeAssertions;
using Client.Telemetry;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Playwright;
using NUnit.Framework;
using Tests.Shared;

namespace Tests.Frontend;

/// <summary>Checks frontend telemetry in the built app running in Chromium, against a fake backend.</summary>
[TestFixture]
[TestOf(typeof(FrontendTracer))]
public sealed class FrontendTelemetryBrowserTests
{
    private static readonly TimeSpan ExportWait = TimeSpan.FromSeconds(20);

    [Test]
    [OpenSpecScenario("client-telemetry", "Frontend navigation is traced", "The initial load carries boot timing")]
    public async Task InitialLoad_NavigationSpanStartsAtNavigationStart_AndCarriesBootTiming()
    {
        await using var server = await FrontendAppServer.StartAsync(static app => MapCurrencies(app, "2026-10-01T00:00:00.000Z"));
        await using var session = await BrowserSession.OpenAsync(server, "/currencies");

        var navigation = await WaitForSpanAsync(server, static s => s.Name == "nav /currencies");

        var timeOrigin = await session.Page.EvaluateAsync<double>("performance.timeOrigin");
        (navigation.StartTimeUnixNano / 1_000_000.0).Should().BeApproximately(timeOrigin, 1);
        navigation.ParentSpanId.Should().BeNull();
        navigation.Attributes.Should().ContainKeys("boot.framework.download_ms", "boot.first_render_ms");
        double.Parse(navigation.Attributes["boot.framework.download_ms"], System.Globalization.CultureInfo.InvariantCulture).Should().BePositive();
        double.Parse(navigation.Attributes["boot.first_render_ms"], System.Globalization.CultureInfo.InvariantCulture).Should().BePositive();
        navigation.Events.Should().Contain(["responseEnd", "domContentLoaded", "framework.loaded", "first_render"]);
        navigation.Resource["service.name"].Should().Be("ebay_frontend");
        server.Posts.Should().OnlyContain(static p => !p.HasTraceParent);
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Client errors are logged and recorded on spans", "An unhandled frontend render exception is logged")]
    public async Task RenderException_IsExportedAsErrorRecordInTheNavigationTrace()
    {
        // The currencies page parses the date while rendering, so a malformed one throws during render.
        await using var server = await FrontendAppServer.StartAsync(static app => MapCurrencies(app, "not a date"));
        await using var session = await BrowserSession.OpenAsync(server, "/currencies");

        var error = await WaitForLogAsync(server, static l => l.SeverityNumber >= 17 && l.Attributes.ContainsKey("exception.type"));

        error.Attributes["exception.type"].Should().Be(typeof(FormatException).FullName);
        error.Attributes["exception.message"].Should().NotBeEmpty();
        var navigation = await WaitForSpanAsync(server, static s => s.Name == "nav /currencies");
        error.TraceId.Should().Be(navigation.TraceId);
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Pending telemetry leaves the page when it is hidden", "Frontend records are exported when the tab is hidden")]
    public async Task HidingTheTab_ExportsPendingRecordsWithoutWaitingForTheInterval()
    {
        await using var server = await FrontendAppServer.StartAsync(static app => MapCurrencies(app, "2026-10-01T00:00:00.000Z"));
        await using var session = await BrowserSession.OpenAsync(server, "/currencies");
        await WaitForSpanAsync(server, static s => s.Name == "nav /currencies");

        // Keep a record pending at every export tick, so each tick posts and can be observed. Without it the app
        // may have nothing to export and the next tick is invisible.
        await session.Page.EvaluateAsync("""
            () => setInterval(() => window.dispatchEvent(new ErrorEvent('error', { error: new Error('tick-marker'), message: 'tick-marker' })), 100)
            """);

        // Right after an export tick, so the next tick is almost a full interval away.
        var lastPost = server.Posts.Count;
        await WaitUntilAsync(() => server.Posts.Skip(lastPost).Any(static p => p.Body.Contains("tick-marker", StringComparison.Ordinal)));
        var hiddenAt = DateTimeOffset.UtcNow;
        await session.Page.EvaluateAsync("""
            () => {
                window.dispatchEvent(new ErrorEvent('error', { error: new TypeError('flush-probe'), message: 'flush-probe' }));
                Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
                document.dispatchEvent(new Event('visibilitychange'));
            }
            """);

        var probe = await WaitForLogAsync(server, static l => l.Attributes.GetValueOrDefault("exception.message") == "flush-probe");
        probe.Attributes["exception.type"].Should().Be("TypeError");
        var post = server.Posts.First(static p => p.Signal == "logs" && p.Body.Contains("flush-probe", StringComparison.Ordinal));
        (post.ReceivedAt - hiddenAt).Should().BeLessThan(TelemetryExporter.ExportInterval / 2);
    }

    private static void MapCurrencies(WebApplication app, string lastUpdate) =>
        app.MapGet("/api/ebay/v1/currencies/", () => Results.Json(new[]
        {
            new { ebayName = "USD", rusName = "Доллар", rate = 1.0, lastUpdate }
        }));

    private static async Task<OtlpJson.ExportedSpan> WaitForSpanAsync(FrontendAppServer server, Func<OtlpJson.ExportedSpan, bool> match)
    {
        OtlpJson.ExportedSpan? found = null;
        await WaitUntilAsync(() =>
        {
            found = server.Posts.Where(static p => p.Signal == "traces").SelectMany(static p => OtlpJson.Spans(p.Body)).FirstOrDefault(match);
            return found is not null;
        });
        return found!;
    }

    private static async Task<OtlpJson.ExportedLog> WaitForLogAsync(FrontendAppServer server, Func<OtlpJson.ExportedLog, bool> match)
    {
        OtlpJson.ExportedLog? found = null;
        await WaitUntilAsync(() =>
        {
            found = server.Posts.Where(static p => p.Signal == "logs").SelectMany(static p => OtlpJson.Logs(p.Body)).FirstOrDefault(match);
            return found is not null;
        });
        return found!;
    }

    private static async Task WaitUntilAsync(Func<bool> condition)
    {
        var deadline = DateTimeOffset.UtcNow + ExportWait;
        while (!condition())
        {
            if (DateTimeOffset.UtcNow > deadline)
            {
                Assert.Fail("The expected telemetry was not exported in time.");
            }

            await Task.Delay(TimeSpan.FromMilliseconds(20));
        }
    }

    private sealed class BrowserSession : IAsyncDisposable
    {
        private readonly IPlaywright _playwright;
        private readonly IBrowser _browser;

        private BrowserSession(IPlaywright playwright, IBrowser browser, IPage page)
        {
            _playwright = playwright;
            _browser = browser;
            Page = page;
        }

        public IPage Page { get; }

        public static async Task<BrowserSession> OpenAsync(FrontendAppServer server, string path)
        {
            var playwright = await Playwright.CreateAsync();
            var browser = await playwright.Chromium.LaunchAsync(new() { Headless = true });
            var page = await browser.NewPageAsync();
            page.Console += static (_, m) => TestContext.Out.WriteLine("console " + m.Type + ": " + m.Text);
            page.PageError += static (_, m) => TestContext.Out.WriteLine("pageerror: " + m);
            await page.AddInitScriptAsync(server.SignInScript);
            await page.GotoAsync(server.BaseAddress + path);
            return new BrowserSession(playwright, browser, page);
        }

        public async ValueTask DisposeAsync()
        {
            await _browser.DisposeAsync();
            _playwright.Dispose();
        }
    }
}
