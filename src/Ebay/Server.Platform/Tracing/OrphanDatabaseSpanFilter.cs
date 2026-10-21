using System.Diagnostics;
using OpenTelemetry;

namespace Server.Platform.Tracing;

/// <summary>
/// Stops exporting database spans that have no parent span. Such commands come from background polling
/// (the MassTransit SQL transport, outbox and scheduler) and would otherwise create one trace per poll.
/// </summary>
/// <remarks>
/// The decision is made when the span starts, so the result does not depend on where this processor sits
/// relative to the exporters: exporters skip activities whose <see cref="Activity.Recorded"/> flag is cleared.
/// </remarks>
internal sealed class OrphanDatabaseSpanFilter : BaseProcessor<Activity>
{
    /// <summary>Name of Npgsql's own <see cref="ActivitySource"/>.</summary>
    internal const string DatabaseSourceName = "Npgsql";

    public override void OnStart(Activity data)
    {
        if (data.Source.Name == DatabaseSourceName && data.ParentSpanId == default)
        {
            data.ActivityTraceFlags &= ~ActivityTraceFlags.Recorded;
        }
    }
}
