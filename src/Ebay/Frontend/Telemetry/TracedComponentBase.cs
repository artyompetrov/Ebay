using System.Diagnostics;
using Microsoft.AspNetCore.Components;

namespace Client.Telemetry;

/// <summary>
/// A component whose lifecycle steps are spans (openspec/specs/client-telemetry, "Frontend component work and interop
/// are traced"): <c>initialize</c> (the first <see cref="ComponentBase.SetParametersAsync"/>, i.e.
/// <c>OnInitialized(Async)</c> and the first <c>OnParametersSet(Async)</c>), <c>parameters set</c> (every later one)
/// and <c>render</c> (from the render request to <c>OnAfterRender</c>). The step span is
/// <see cref="Activity.Current"/> while the step runs, so backend calls made by it are its children.
/// For components other than routed pages the spans are exported only when a step takes 16 ms or more.
/// A derived component that overrides <see cref="ShouldRender"/> must call the base method.
/// </summary>
public abstract class TracedComponentBase : ComponentBase, IHandleAfterRender
{
    private bool _initialized;
    private bool _afterRenderCalled;
    private int _afterRenderCount;
    private DateTimeOffset? _renderRequestedAt;
    private (DateTimeOffset Requested, DateTimeOffset Rendered)? _lastRender;
    private Activity? _navigationToComplete;

    /// <summary>Set by Blazor (<c>[Inject]</c>) before any lifecycle method runs.</summary>
    [Inject]
    private FrontendTracer Tracer { get; set; } = null!;

    /// <summary>Routed pages export all their steps and end the navigation they render.</summary>
    private protected virtual bool IsPage => false;

    /// <inheritdoc />
    public override async Task SetParametersAsync(ParameterView parameters)
    {
        var step = _initialized ? "parameters set" : "initialize";
        if (!_initialized)
        {
            _initialized = true;
            _renderRequestedAt = Tracer.Now;
        }

        var navigation = IsPage ? Tracer.CurrentNavigation : null;
        var afterRenderCount = _afterRenderCount;
        var activity = Tracer.StartActivity(GetType().Name + " " + step, ActivityKind.Internal);
        if (!IsPage)
        {
            FrontendTracer.MarkExportOnlyIfSlow(activity);
        }

        bool completedSynchronously;
        try
        {
            // Current for this async method only: the caller's context is restored when it returns.
            Activity.Current = activity ?? Activity.Current;
            var task = base.SetParametersAsync(parameters);
            completedSynchronously = task.IsCompleted;
            if (completedSynchronously)
            {
                // The render of the final state is still queued: its OnAfterRender ends the navigation.
                _navigationToComplete = navigation;
            }

            await task;
        }
        catch (Exception exception)
        {
            FrontendTracer.RecordException(activity, exception);
            throw;
        }
        finally
        {
            // Ended before the navigation it belongs to is completed below.
            activity?.Dispose();
        }

        if (navigation is null || completedSynchronously)
        {
            return;
        }

        // Completed asynchronously: ComponentBase rendered the final state before its task completed.
        if (_afterRenderCount > afterRenderCount && _lastRender is { } last)
        {
            CompleteNavigation(navigation, last.Requested, last.Rendered);
        }
        else
        {
            _navigationToComplete = navigation;
        }
    }

    Task IHandleAfterRender.OnAfterRenderAsync()
    {
        var firstRender = !_afterRenderCalled;
        _afterRenderCalled = true;
        _afterRenderCount++;
        var rendered = Tracer.Now;
        var requested = _renderRequestedAt ?? rendered;
        _renderRequestedAt = null;
        _lastRender = (requested, rendered);
        if (_navigationToComplete is { } navigation)
        {
            _navigationToComplete = null;
            CompleteNavigation(navigation, requested, rendered);
        }
        else if (!IsPage)
        {
            RecordRender(Tracer.CurrentContext() ?? default, requested, rendered, exportOnlyIfSlow: true);
        }

        OnAfterRender(firstRender);
        return OnAfterRenderAsync(firstRender);
    }

    /// <inheritdoc />
    protected override bool ShouldRender()
    {
        _renderRequestedAt ??= Tracer.Now;
        return true;
    }

    private void CompleteNavigation(Activity navigation, DateTimeOffset requested, DateTimeOffset rendered)
    {
        RecordRender(navigation.Context, requested, rendered, exportOnlyIfSlow: false);
        Tracer.CompleteNavigation(navigation);
    }

    private void RecordRender(ActivityContext parent, DateTimeOffset requested, DateTimeOffset rendered, bool exportOnlyIfSlow)
    {
        using var activity = FrontendTracer.StartActivity(GetType().Name + " render", ActivityKind.Internal, parent, requested);
        if (activity is null)
        {
            return;
        }

        if (exportOnlyIfSlow)
        {
            FrontendTracer.MarkExportOnlyIfSlow(activity);
        }

        activity.SetEndTime(rendered.UtcDateTime);
    }
}
