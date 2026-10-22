using System.Diagnostics;
using AwesomeAssertions;
using Server.Adapters.Driving.BackgroundTasks;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(BackgroundJobTracing))]
public sealed class BackgroundJobTracingTests
{
    private const string TestSourceName = $"Tests.Unit.{nameof(BackgroundJobTracingTests)}";

    private static readonly ActivitySource TestSource = new(TestSourceName);

    [Test]
    [OpenSpecScenario("observability-tracing", "Background job runs are traced", "Work inside a run belongs to the run's trace")]
    public async Task RunAsync_SpanStartedByTheJob_IsChildOfTheRunSpan()
    {
        using var recorder = new BackgroundJobSpanRecorder(TestSourceName);
        var jobName = NewJobName();
        var childName = $"{jobName}.child";

        await BackgroundJobTracing.RunAsync(
            jobName,
            _ =>
            {
                TestSource.StartActivity(childName)?.Dispose();
                return Task.CompletedTask;
            },
            CancellationToken.None);

        var run = recorder.Named(jobName).Should().ContainSingle().Subject;
        var child = recorder.Named(childName).Should().ContainSingle().Subject;
        run.ParentSpanId.Should().Be(default(ActivitySpanId));
        child.TraceId.Should().Be(run.TraceId);
        child.ParentSpanId.Should().Be(run.SpanId);
    }

    [Test]
    [OpenSpecScenario("observability-tracing", "Background job runs are traced", "A failing run marks its span as an error")]
    public async Task RunAsync_JobThrows_MarksSpanAsErrorAndRethrows()
    {
        using var recorder = new BackgroundJobSpanRecorder(TestSourceName);
        var jobName = NewJobName();

        var run = () => BackgroundJobTracing.RunAsync(
            jobName, static _ => throw new InvalidOperationException("job failed"), CancellationToken.None);

        await run.Should().ThrowAsync<InvalidOperationException>();
        var span = recorder.Named(jobName).Should().ContainSingle().Subject;
        span.Status.Should().Be(ActivityStatusCode.Error);
        span.Events.Should().Contain(static spanEvent => spanEvent.Name == "exception");
    }

    [Test]
    [OpenSpecScenario("observability-tracing", "Background job runs are traced", "A run stopped by shutdown is not an error")]
    public async Task RunAsync_CancelledByShutdown_DoesNotMarkSpanAsError()
    {
        using var recorder = new BackgroundJobSpanRecorder(TestSourceName);
        using var shutdown = new CancellationTokenSource();
        await shutdown.CancelAsync();
        var jobName = NewJobName();

        var run = () => BackgroundJobTracing.RunAsync(
            jobName, static cancellationToken => Task.Delay(Timeout.Infinite, cancellationToken), shutdown.Token);

        await run.Should().ThrowAsync<OperationCanceledException>();
        recorder.Named(jobName).Should().ContainSingle().Which.Status.Should().NotBe(ActivityStatusCode.Error);
    }

    private static string NewJobName() => $"test-job-{Guid.NewGuid():N}";
}
