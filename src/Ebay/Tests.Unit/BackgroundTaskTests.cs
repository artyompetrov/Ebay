using AwesomeAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Server.Adapters.Driving.BackgroundTasks;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(BackgroundTask))]
public sealed class BackgroundTaskTests
{
    private const int ExpectedRuns = 2;
    private static readonly TimeSpan WaitTimeout = TimeSpan.FromSeconds(10);

    [Test]
    [OpenSpecScenario("observability-tracing", "Background job runs are traced", "Each periodic job run is a separate trace")]
    public async Task EveryIteration_IsRecordedAsSeparateRootTrace()
    {
        using var recorder = new BackgroundJobSpanRecorder(nameof(BackgroundTaskTests));
        using var job = new TwoRunsBackgroundTask();

        await job.StartAsync(CancellationToken.None);
        await job.TwoRunsCompleted.WaitAsync(WaitTimeout);
        await job.StopAsync(CancellationToken.None);

        var runs = recorder.Named(nameof(TwoRunsBackgroundTask));
        runs.Should().HaveCountGreaterThanOrEqualTo(ExpectedRuns);
        runs.Should().OnlyContain(static span => span.ParentSpanId == default);
        runs.Select(static span => span.TraceId).Should().OnlyHaveUniqueItems();
    }

    private sealed class TwoRunsBackgroundTask : BackgroundTask
    {
        private readonly TaskCompletionSource _twoRunsCompleted = new(TaskCreationOptions.RunContinuationsAsynchronously);
        private int _runs;

        public TwoRunsBackgroundTask()
            : base(NullLogger.Instance)
        {
        }

        public Task TwoRunsCompleted => _twoRunsCompleted.Task;

        public override TimeSpan UpdateTime => TimeSpan.Zero;

        public override TimeSpan ErrorDelay => TimeSpan.Zero;

        protected override Task BackgroundTaskImplementation(CancellationToken cancellationToken)
        {
            if (Interlocked.Increment(ref _runs) == ExpectedRuns)
            {
                _twoRunsCompleted.TrySetResult();
            }

            return Task.CompletedTask;
        }
    }
}
