using System.Collections.Concurrent;
using System.Diagnostics;
using AwesomeAssertions;
using Microsoft.Extensions.Caching.Memory;
using Server.Adapters.Driven.MemoryCache;
using Tests.Shared;
using MsMemoryCache = Microsoft.Extensions.Caching.Memory.MemoryCache;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementContentCacheAdapter))]
public sealed class MeasurementContentCacheAdapterTests
{
    private const string MeasurementId = "measurement-1";
    private const string OtherMeasurementId = "measurement-2";
    private const string CacheSourceName = "Server.Adapters.Driven.MemoryCache";
    private const string CacheSpanName = "measurement-content-cache.get";
    private const string CacheHitTag = "cache.hit";
    private const string CacheKeyTag = "cache.key";
    private const string FactorySourceName = $"Tests.Unit.{nameof(MeasurementContentCacheAdapterTests)}";

    private static readonly ActivitySource FactorySource = new(FactorySourceName);

    [Test]
    [OpenSpecScenario("observability-tracing", "Measurement content cache lookups are traced", "A cache miss is recorded")]
    public async Task GetOrCreateAsync_Miss_RecordsSpanWithCacheHitFalseAndFactoryUnderIt()
    {
        using var recorder = new SpanRecorder();
        using var memoryCache = new MsMemoryCache(new MemoryCacheOptions());
        var adapter = new MeasurementContentCacheAdapter(memoryCache, new MeasurementCacheInvalidationRegistry());
        var key = $"miss-{Guid.NewGuid():N}";
        var factoryOperationName = $"produce-{key}";

        await adapter.GetOrCreateAsync(
            MeasurementId,
            key,
            () =>
            {
                FactorySource.StartActivity(factoryOperationName)?.Dispose();
                return Task.FromResult<string?>(CountingFactory.Value);
            },
            static s => s.Length);

        var lookup = recorder.LookupsOf(key).Should().ContainSingle().Subject;
        lookup.GetTagItem(CacheHitTag).Should().Be(false);
        var produce = recorder.Named(factoryOperationName).Should().ContainSingle().Subject;
        produce.ParentSpanId.Should().Be(lookup.SpanId);
    }

    [Test]
    [OpenSpecScenario("observability-tracing", "Measurement content cache lookups are traced", "A cache hit is recorded")]
    public async Task GetOrCreateAsync_Hit_RecordsSpanWithCacheHitTrue()
    {
        using var recorder = new SpanRecorder();
        using var memoryCache = new MsMemoryCache(new MemoryCacheOptions());
        var adapter = new MeasurementContentCacheAdapter(memoryCache, new MeasurementCacheInvalidationRegistry());
        var factory = new CountingFactory();
        var key = $"hit-{Guid.NewGuid():N}";

        await adapter.GetOrCreateAsync(MeasurementId, key, factory.Create, static s => s.Length);
        await adapter.GetOrCreateAsync(MeasurementId, key, factory.Create, static s => s.Length);

        recorder.LookupsOf(key).Select(static span => span.GetTagItem(CacheHitTag))
            .Should().Equal(false, true);
    }

    [Test]
    public async Task GetOrCreateAsync_SecondCall_IsServedFromCache()
    {
        using var memoryCache = new MsMemoryCache(new MemoryCacheOptions());
        var adapter = new MeasurementContentCacheAdapter(memoryCache, new MeasurementCacheInvalidationRegistry());
        var factory = new CountingFactory();

        await adapter.GetOrCreateAsync(MeasurementId, "key", factory.Create, static s => s.Length);
        var second = await adapter.GetOrCreateAsync(MeasurementId, "key", factory.Create, static s => s.Length);

        second.Should().Be(CountingFactory.Value);
        factory.CallCount.Should().Be(1);
    }

    [Test]
    public async Task Invalidate_EvictsAllEntriesOfTheMeasurement_AndKeepsOtherMeasurements()
    {
        using var memoryCache = new MsMemoryCache(new MemoryCacheOptions());
        var adapter = new MeasurementContentCacheAdapter(memoryCache, new MeasurementCacheInvalidationRegistry());
        var firstEntry = new CountingFactory();
        var secondEntry = new CountingFactory();
        var otherMeasurementEntry = new CountingFactory();
        await adapter.GetOrCreateAsync(MeasurementId, "photo", firstEntry.Create, static s => s.Length);
        await adapter.GetOrCreateAsync(MeasurementId, "plot", secondEntry.Create, static s => s.Length);
        await adapter.GetOrCreateAsync(OtherMeasurementId, "other", otherMeasurementEntry.Create, static s => s.Length);

        adapter.Invalidate(MeasurementId);

        await adapter.GetOrCreateAsync(MeasurementId, "photo", firstEntry.Create, static s => s.Length);
        await adapter.GetOrCreateAsync(MeasurementId, "plot", secondEntry.Create, static s => s.Length);
        await adapter.GetOrCreateAsync(OtherMeasurementId, "other", otherMeasurementEntry.Create, static s => s.Length);
        firstEntry.CallCount.Should().Be(2);
        secondEntry.CallCount.Should().Be(2);
        otherMeasurementEntry.CallCount.Should().Be(1);
    }

    [Test]
    public async Task Remove_EvictsOnlyTheGivenKey()
    {
        using var memoryCache = new MsMemoryCache(new MemoryCacheOptions());
        var adapter = new MeasurementContentCacheAdapter(memoryCache, new MeasurementCacheInvalidationRegistry());
        var removed = new CountingFactory();
        var kept = new CountingFactory();
        await adapter.GetOrCreateAsync(MeasurementId, "removed", removed.Create, static s => s.Length);
        await adapter.GetOrCreateAsync(MeasurementId, "kept", kept.Create, static s => s.Length);

        adapter.Remove("removed");

        await adapter.GetOrCreateAsync(MeasurementId, "removed", removed.Create, static s => s.Length);
        await adapter.GetOrCreateAsync(MeasurementId, "kept", kept.Create, static s => s.Length);
        removed.CallCount.Should().Be(2);
        kept.CallCount.Should().Be(1);
    }

    private sealed class CountingFactory
    {
        public const string Value = "value";

        public int CallCount { get; private set; }

        public Task<string?> Create()
        {
            CallCount++;
            return Task.FromResult<string?>(Value);
        }
    }

    /// <summary>
    /// Collects finished spans of the cache adapter and of this test's factory source. Tests run in parallel,
    /// so each test looks only at spans of its own cache key or operation name.
    /// </summary>
    private sealed class SpanRecorder : IDisposable
    {
        private readonly ActivityListener _listener;
        private readonly ConcurrentQueue<Activity> _spans = new();

        public SpanRecorder()
        {
            _listener = new ActivityListener
            {
                ShouldListenTo = static source => source.Name is CacheSourceName or FactorySourceName,
                Sample = static (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllDataAndRecorded,
                ActivityStopped = activity => _spans.Enqueue(activity)
            };
            ActivitySource.AddActivityListener(_listener);
        }

        public Activity[] LookupsOf(string key) =>
            [.. _spans.Where(span => span.OperationName == CacheSpanName && (string?)span.GetTagItem(CacheKeyTag) == key)];

        public Activity[] Named(string operationName) => [.. _spans.Where(span => span.OperationName == operationName)];

        public void Dispose() => _listener.Dispose();
    }
}
