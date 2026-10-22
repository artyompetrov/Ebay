using System.Diagnostics;
using System.Text.Json;
using AwesomeAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Server.Adapters.Driving.BackgroundTasks;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.DbCache;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(DbCacheCleanupHostedService))]
public sealed class DbCacheCleanupHostedServiceTests
{
    private const string UnrelatedSourceName = $"Tests.Unit.{nameof(DbCacheCleanupHostedServiceTests)}";

    private static readonly ActivitySource UnrelatedSource = new(UnrelatedSourceName);

    [Test]
    [OpenSpecScenario("observability-tracing", "Background job runs are traced", "A startup job run is its own trace")]
    public async Task StartAsync_UnderUnrelatedSpan_RecordsRunAsRootOfNewTrace()
    {
        using var recorder = new BackgroundJobSpanRecorder(UnrelatedSourceName);
        var service = new DbCacheCleanupHostedService(
            new DbCacheCleanupService(new NoOpCacheStore()), NullLogger<DbCacheCleanupHostedService>.Instance);

        ActivityTraceId unrelatedTraceId;
        using (var unrelated = UnrelatedSource.StartActivity("unrelated")
                   ?? throw new InvalidOperationException("The recorder samples this source, so the activity must be created."))
        {
            unrelatedTraceId = unrelated.TraceId;
            await service.StartAsync(CancellationToken.None);
        }

        var run = recorder.Named(nameof(DbCacheCleanupHostedService)).Should().ContainSingle().Subject;
        run.ParentSpanId.Should().Be(default(ActivitySpanId));
        run.TraceId.Should().NotBe(unrelatedTraceId);
    }

    private sealed class NoOpCacheStore : ICacheStore
    {
        public Task RemoveOldVersionsAsync(CancellationToken cancellationToken) => Task.CompletedTask;

        public Task<T?> GetOrCreateAsync<T>(
            string key,
            Func<Task<T?>> factory,
            TimeSpan ttl,
            CancellationToken cancellationToken,
            JsonSerializerOptions? jsonOptions = null) =>
            throw new NotSupportedException();
    }
}
