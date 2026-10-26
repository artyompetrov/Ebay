using Microsoft.Extensions.Logging;

namespace Client.Telemetry;

/// <summary>
/// Pulls what the browser observed since the last export tick: clicks become interaction spans, Web Vitals and long
/// frames become span events, uncaught JS errors become Error records.
/// </summary>
internal sealed class BrowserTelemetryCollector
{
    private readonly IBrowserTelemetry _browser;
    private readonly FrontendTracer _tracer;
    private readonly ILogger _errorLogger;

    public BrowserTelemetryCollector(IBrowserTelemetry browser, FrontendTracer tracer, ILoggerFactory loggerFactory)
    {
        _browser = browser;
        _tracer = tracer;
        _errorLogger = loggerFactory.CreateLogger(UnhandledErrorLogging.Category);
    }

    public void Collect()
    {
        _tracer.PullInteractions();
        var events = _browser.TakeEvents();
        _tracer.RecordVitals(events.Vitals);
        foreach (var error in events.Errors)
        {
            UnhandledErrorLogging.LogJavaScriptError(_errorLogger, error);
        }
    }
}
