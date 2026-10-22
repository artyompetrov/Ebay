using System.Collections.Concurrent;
using System.Diagnostics;
using Server.Adapters.Driving.BackgroundTasks;

namespace Tests.Unit.Fakes;

/// <summary>
/// Collects finished spans of background job runs (and of an extra test source). Tests run in parallel and
/// share the process-wide sources, so each test looks only at spans with its own job or operation name.
/// </summary>
internal sealed class BackgroundJobSpanRecorder : IDisposable
{
    private readonly ActivityListener _listener;
    private readonly ConcurrentQueue<Activity> _spans = new();

    public BackgroundJobSpanRecorder(string extraSourceName)
    {
        _listener = new ActivityListener
        {
            ShouldListenTo = source => source.Name == BackgroundJobTracing.ActivitySourceName || source.Name == extraSourceName,
            Sample = static (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllDataAndRecorded,
            ActivityStopped = activity => _spans.Enqueue(activity)
        };
        ActivitySource.AddActivityListener(_listener);
    }

    public Activity[] Named(string operationName) => [.. _spans.Where(span => span.OperationName == operationName)];

    public void Dispose() => _listener.Dispose();
}
