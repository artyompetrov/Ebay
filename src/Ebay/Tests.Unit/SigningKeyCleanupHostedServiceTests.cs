using System.Diagnostics;
using AwesomeAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Server.Adapters.Driving.BackgroundTasks;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.SigningKeys;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(SigningKeyCleanupHostedService))]
public sealed class SigningKeyCleanupHostedServiceTests
{
    private const string UnrelatedSourceName = $"Tests.Unit.{nameof(SigningKeyCleanupHostedServiceTests)}";

    private static readonly ActivitySource UnrelatedSource = new(UnrelatedSourceName);

    [Test]
    [OpenSpecScenario("observability-tracing", "Background job runs are traced", "The startup signing key cleanup is its own trace")]
    public async Task StartAsync_UnderUnrelatedSpan_RecordsRunAsRootOfNewTrace()
    {
        using var recorder = new BackgroundJobSpanRecorder(UnrelatedSourceName);
        var adapter = new StubSigningKeyCleanupAdapter(removedCount: 1);
        var service = CreateService(adapter, NullLogger<SigningKeyCleanupHostedService>.Instance);

        ActivityTraceId unrelatedTraceId;
        using (var unrelated = UnrelatedSource.StartActivity("unrelated")
                   ?? throw new InvalidOperationException("The recorder samples this source, so the activity must be created."))
        {
            unrelatedTraceId = unrelated.TraceId;
            await service.StartAsync(CancellationToken.None);
        }

        adapter.CallCount.Should().Be(1);
        var run = recorder.Named(nameof(SigningKeyCleanupHostedService)).Should().ContainSingle().Subject;
        run.ParentSpanId.Should().Be(default(ActivitySpanId));
        run.TraceId.Should().NotBe(unrelatedTraceId);
    }

    [Test]
    public async Task StartAsync_CleanupFails_LogsErrorAndDoesNotStopStartup()
    {
        var adapter = new StubSigningKeyCleanupAdapter(failure: new InvalidOperationException("store unavailable"));
        var logger = new RecordingLogger<SigningKeyCleanupHostedService>();
        var service = CreateService(adapter, logger);

        var start = () => service.StartAsync(CancellationToken.None);

        await start.Should().NotThrowAsync();
        logger.HasErrorContaining("unreadable signing keys").Should().BeTrue();
    }

    private static SigningKeyCleanupHostedService CreateService(
        ISigningKeyCleanupAdapter adapter,
        Microsoft.Extensions.Logging.ILogger<SigningKeyCleanupHostedService> logger) =>
        new(new SigningKeyCleanupService(adapter, NullLogger<SigningKeyCleanupService>.Instance), logger);

    private sealed class StubSigningKeyCleanupAdapter : ISigningKeyCleanupAdapter
    {
        private readonly int _removedCount;
        private readonly Exception? _failure;

        public StubSigningKeyCleanupAdapter(int removedCount = 0, Exception? failure = null)
        {
            _removedCount = removedCount;
            _failure = failure;
        }

        public int CallCount { get; private set; }

        public async Task<int> RemoveUnreadableKeysAsync(CancellationToken cancellationToken)
        {
            CallCount++;
            await Task.Yield();
            return _failure is null ? _removedCount : throw _failure;
        }
    }
}
