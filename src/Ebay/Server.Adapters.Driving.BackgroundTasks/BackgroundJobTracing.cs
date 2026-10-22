using System.Diagnostics;

namespace Server.Adapters.Driving.BackgroundTasks;

/// <summary>
/// Records every background job run as its own trace (<c>openspec/specs/observability-tracing</c>):
/// the platform exports this source because its name starts with <c>Server.</c>.
/// </summary>
internal static class BackgroundJobTracing
{
    /// <summary>Name of the span source of background job runs.</summary>
    public const string ActivitySourceName = "Server.Adapters.Driving.BackgroundTasks";

    private static readonly ActivitySource ActivitySource = new(ActivitySourceName);

    /// <summary>
    /// Runs <paramref name="work"/> inside a root span named <paramref name="jobName"/>. A failure marks the span
    /// as an error and is rethrown; cancellation by <paramref name="cancellationToken"/> (shutdown) is not an error.
    /// </summary>
    public static async Task RunAsync(string jobName, Func<CancellationToken, Task> work, CancellationToken cancellationToken)
    {
        // A run is an independent process, not part of whatever span started the job (host startup, a test).
        // This is an async method, so clearing the ambient span does not leak back to the caller.
        Activity.Current = null;
        using var activity = ActivitySource.StartActivity(jobName);

        try
        {
            await work(cancellationToken);
        }
        catch (Exception exception) when (exception.IsNotIntendedCancellation(cancellationToken))
        {
            activity?.SetStatus(ActivityStatusCode.Error, exception.Message);
            activity?.AddException(exception);
            throw;
        }
    }
}
