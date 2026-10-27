namespace Client.Telemetry;

/// <summary>What the browser side (<c>interop.js</c>) observed; every <c>Take*</c> call returns and forgets the new entries.</summary>
internal interface IBrowserTelemetry
{
    /// <summary>The navigation start of the page, in milliseconds since the Unix epoch.</summary>
    double TimeOrigin { get; }

    IReadOnlyList<BrowserClick> TakeClicks();

    BootTiming TakeBootTiming();

    BrowserEvents TakeEvents();
}
