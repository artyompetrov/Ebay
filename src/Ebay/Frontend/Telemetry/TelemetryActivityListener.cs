using System.Diagnostics;

namespace Client.Telemetry;

/// <summary>Records every stopped frontend span into the buffer, except fast steps of non-page components.</summary>
internal sealed class TelemetryActivityListener : IDisposable
{
    private readonly ActivityListener _listener;

    public TelemetryActivityListener(TelemetryBuffer buffer, FrontendTracer tracer)
    {
        _listener = new ActivityListener
        {
            ShouldListenTo = static source => source.Name == FrontendActivitySource.Name,
            Sample = static (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllDataAndRecorded,
            ActivityStopped = activity =>
            {
                tracer.OnStopped(activity);
                if (FrontendTracer.IsExportOnlyIfSlow(activity) && activity.Duration < FrontendTracer.SlowStepThreshold)
                {
                    return;
                }

                buffer.Add(SpanData.From(activity));
            }
        };
        ActivitySource.AddActivityListener(_listener);
    }

    public void Dispose() => _listener.Dispose();
}
