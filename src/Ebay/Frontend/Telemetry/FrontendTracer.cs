using System.Diagnostics;

namespace Client.Telemetry;

/// <summary>
/// Starts the frontend's spans and keeps the context Blazor does not flow (openspec/specs/client-telemetry, design
/// D3): event handlers and lifecycle methods do not see an <see cref="Activity.Current"/> set elsewhere, so a span
/// without one becomes a child of the latest click (for <see cref="InteractionWindow"/>) or of the running
/// navigation, whichever started later.
/// Every span is started without becoming <see cref="Activity.Current"/>: only async methods that own a span make it
/// current, so it ends with them and never leaks into unrelated work.
/// Deliberately process-wide state: one app per browser tab.
/// </summary>
internal sealed class FrontendTracer
{
    public static readonly TimeSpan InteractionWindow = TimeSpan.FromSeconds(1);

    /// <summary>Lifecycle steps of non-page components are exported only when they take at least this long.</summary>
    public static readonly TimeSpan SlowStepThreshold = TimeSpan.FromMilliseconds(16);

    private const string ExportOnlyIfSlowProperty = "frontend.export_only_if_slow";

    private readonly IBrowserTelemetry _browser;
    private readonly TimeProvider _time;
    private readonly Lock _lock = new();
    private Activity? _navigation;
    private Activity? _initialNavigation;
    private ActivityContext? _initialNavigationContext;
    private Interaction? _interaction;

    public FrontendTracer(IBrowserTelemetry browser, TimeProvider time)
    {
        _browser = browser;
        _time = time;
    }

    /// <summary>The navigation whose page has not rendered yet, if any.</summary>
    public Activity? CurrentNavigation
    {
        get
        {
            lock (_lock)
            {
                return _navigation;
            }
        }
    }

    public DateTimeOffset Now => _time.GetUtcNow();

    public static bool IsExportOnlyIfSlow(Activity activity) => activity.GetCustomProperty(ExportOnlyIfSlowProperty) is true;

    public static void MarkExportOnlyIfSlow(Activity? activity) => activity?.SetCustomProperty(ExportOnlyIfSlowProperty, true);

    public static void RecordException(Activity? activity, Exception exception)
    {
        if (activity is null)
        {
            return;
        }

        activity.AddException(exception);
        activity.SetTag("error.type", exception.GetType().FullName);
        activity.SetStatus(ActivityStatusCode.Error, exception.Message);
    }

    /// <summary>Starts a child of the current context (see the class remarks).</summary>
    public Activity? StartActivity(string name, ActivityKind kind) => StartDetached(name, kind, CurrentParent(), links: null, startTime: default);

    /// <summary>Starts a child of <paramref name="parent"/> (a root span when it is default) at <paramref name="startTime"/>.</summary>
    public static Activity? StartActivity(string name, ActivityKind kind, ActivityContext parent, DateTimeOffset startTime) =>
        StartDetached(name, kind, parent, links: null, startTime);

    /// <summary>The context new spans and log records belong to, without asking the browser for new clicks.</summary>
    public ActivityContext? CurrentContext()
    {
        if (Activity.Current is { } current)
        {
            return current.Context;
        }

        lock (_lock)
        {
            return FallbackParent()?.Context;
        }
    }

    /// <summary>
    /// Ends the previous navigation if its page never rendered and starts the root span of a new one, named after
    /// the route template. The first navigation of the app load starts at the browser's navigation start.
    /// </summary>
    public Activity? StartNavigation(string routeTemplate, string pageName)
    {
        lock (_lock)
        {
            if (_navigation is { } previous)
            {
                previous.SetTag("frontend.navigation.interrupted", true);
                previous.Stop();
            }

            var initial = _initialNavigationContext is null;
            var startTime = initial ? FromEpochMilliseconds(_browser.TimeOrigin) : default;
            var navigation = StartDetached("nav " + routeTemplate, ActivityKind.Internal, default, links: null, startTime);
            navigation?.SetTag("frontend.route", routeTemplate);
            navigation?.SetTag("frontend.page", pageName);
            navigation?.SetTag("frontend.navigation.initial", initial);
            if (initial && navigation is not null)
            {
                _initialNavigation = navigation;
                _initialNavigationContext = navigation.Context;
            }

            _navigation = navigation;
            return navigation;
        }
    }

    /// <summary>Ends <paramref name="navigation"/> when its page has rendered, unless a newer navigation replaced it.</summary>
    public void CompleteNavigation(Activity navigation)
    {
        lock (_lock)
        {
            if (!ReferenceEquals(_navigation, navigation))
            {
                return;
            }

            _navigation = null;
            if (ReferenceEquals(navigation, _initialNavigation))
            {
                AddBootTiming(navigation);
            }

            navigation.Stop();
        }
    }

    /// <summary>
    /// Turns new clicks into root spans of their own interaction and ends the previous interaction once its window
    /// has passed, at the end of the last span recorded in it.
    /// </summary>
    public void PullInteractions()
    {
        var clicks = _browser.TakeClicks();
        lock (_lock)
        {
            if (_interaction is { } current && _time.GetUtcNow() - current.ClickTime > InteractionWindow)
            {
                EndInteraction();
            }

            foreach (var click in clicks)
            {
                EndInteraction();
                var clickTime = FromEpochMilliseconds(click.Time);
                var activity = StartDetached("click " + click.Id, ActivityKind.Internal, default, links: null, clickTime);
                if (activity is not null)
                {
                    activity.SetTag("frontend.click.target", click.Id);
                    _interaction = new Interaction(activity, clickTime);
                }
            }
        }
    }

    /// <summary>Called for every stopped frontend span; keeps the end of the current interaction's last span.</summary>
    public void OnStopped(Activity activity)
    {
        lock (_lock)
        {
            if (_interaction is { } interaction && activity.TraceId == interaction.Activity.TraceId && !ReferenceEquals(activity, interaction.Activity))
            {
                var end = new DateTimeOffset(activity.StartTimeUtc) + activity.Duration;
                if (end > interaction.LastSpanEnd)
                {
                    interaction.LastSpanEnd = end;
                }
            }
        }
    }

    /// <summary>
    /// Adds Web Vitals and long frames as events: to the initial navigation while it runs, otherwise to a
    /// <c>web_vitals</c> span linked to it.
    /// </summary>
    public void RecordVitals(IReadOnlyList<BrowserVital> vitals)
    {
        if (vitals.Count == 0)
        {
            return;
        }

        lock (_lock)
        {
            if (_navigation is { } navigation && ReferenceEquals(navigation, _initialNavigation))
            {
                AddVitalEvents(navigation, vitals);
                return;
            }

            var links = _initialNavigationContext is { } initial ? new[] { new ActivityLink(initial) } : null;
            var start = FromEpochMilliseconds(vitals.Min(static v => v.Time));
            var span = StartDetached("web_vitals", ActivityKind.Internal, default, links, start);
            if (span is not null)
            {
                AddVitalEvents(span, vitals);
                span.Stop();
            }
        }
    }

    public void TraceInterop(string function, Action call)
    {
        using var activity = StartInterop(function);
        try
        {
            call();
        }
        catch (Exception exception)
        {
            RecordException(activity, exception);
            throw;
        }
    }

    public T TraceInterop<T>(string function, Func<T> call)
    {
        using var activity = StartInterop(function);
        try
        {
            return call();
        }
        catch (Exception exception)
        {
            RecordException(activity, exception);
            throw;
        }
    }

    public async Task TraceInteropAsync(string function, Func<Task> call)
    {
        using var activity = StartInterop(function);
        try
        {
            await call();
        }
        catch (Exception exception)
        {
            RecordException(activity, exception);
            throw;
        }
    }

    public async Task<T> TraceInteropAsync<T>(string function, Func<Task<T>> call)
    {
        using var activity = StartInterop(function);
        try
        {
            return await call();
        }
        catch (Exception exception)
        {
            RecordException(activity, exception);
            throw;
        }
    }

    private static DateTimeOffset FromEpochMilliseconds(double milliseconds) =>
        DateTimeOffset.UnixEpoch + TimeSpan.FromMilliseconds(milliseconds);

    private static Activity? StartDetached(string name, ActivityKind kind, ActivityContext parent, IEnumerable<ActivityLink>? links, DateTimeOffset startTime)
    {
        var previous = Activity.Current;
        // Without a current activity a default parent context makes a root span.
        Activity.Current = null;
        var activity = FrontendActivitySource.Source.StartActivity(name, kind, parent, tags: null, links, startTime);
        Activity.Current = previous;
        return activity;
    }

    private static void AddVitalEvents(Activity activity, IReadOnlyList<BrowserVital> vitals)
    {
        foreach (var vital in vitals)
        {
            var tags = new ActivityTagsCollection { ["value"] = vital.Value };
            if (vital.BlockingDuration is { } blocking)
            {
                tags["blocking_duration"] = blocking;
            }

            activity.AddEvent(new ActivityEvent(vital.Name, FromEpochMilliseconds(vital.Time), tags));
        }
    }

    private Activity? StartInterop(string function)
    {
        var activity = StartActivity("JS " + function, ActivityKind.Internal);
        activity?.SetTag("frontend.js.function", function);
        return activity;
    }

    private ActivityContext CurrentParent()
    {
        if (Activity.Current is { } current)
        {
            return current.Context;
        }

        PullInteractions();
        lock (_lock)
        {
            return FallbackParent()?.Context ?? default;
        }
    }

    private Activity? FallbackParent()
    {
        var interaction = _interaction is { } current && _time.GetUtcNow() - current.ClickTime <= InteractionWindow
            ? current.Activity
            : null;
        if (interaction is null || _navigation is null)
        {
            return interaction ?? _navigation;
        }

        return interaction.StartTimeUtc >= _navigation.StartTimeUtc ? interaction : _navigation;
    }

    private void EndInteraction()
    {
        if (_interaction is not { } interaction)
        {
            return;
        }

        _interaction = null;
        var end = interaction.LastSpanEnd > interaction.ClickTime ? interaction.LastSpanEnd : interaction.ClickTime;
        interaction.Activity.SetEndTime(end.UtcDateTime);
        interaction.Activity.Stop();
    }

    private void AddBootTiming(Activity navigation)
    {
        var boot = _browser.TakeBootTiming();
        if (boot.ResponseEnd is { } responseEnd)
        {
            navigation.AddEvent(new ActivityEvent("responseEnd", FromEpochMilliseconds(responseEnd)));
        }

        if (boot.DomContentLoaded is { } domContentLoaded)
        {
            navigation.AddEvent(new ActivityEvent("domContentLoaded", FromEpochMilliseconds(domContentLoaded)));
        }

        navigation.SetTag("boot.framework.resources", boot.FrameworkResources);
        navigation.SetTag("boot.framework.bytes", boot.FrameworkBytes);
        if (boot is { FrameworkStart: { } frameworkStart, FrameworkEnd: { } frameworkEnd })
        {
            navigation.SetTag("boot.framework.download_ms", frameworkEnd - frameworkStart);
            navigation.AddEvent(new ActivityEvent("framework.loaded", FromEpochMilliseconds(frameworkEnd)));
        }

        var firstRender = _time.GetUtcNow();
        navigation.SetTag("boot.first_render_ms", (firstRender - new DateTimeOffset(navigation.StartTimeUtc)).TotalMilliseconds);
        navigation.AddEvent(new ActivityEvent("first_render", firstRender));
    }

    private sealed class Interaction
    {
        public Interaction(Activity activity, DateTimeOffset clickTime)
        {
            Activity = activity;
            ClickTime = clickTime;
            LastSpanEnd = clickTime;
        }

        public Activity Activity { get; }

        public DateTimeOffset ClickTime { get; }

        public DateTimeOffset LastSpanEnd { get; set; }
    }
}
