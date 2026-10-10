using AwesomeAssertions;
using Microsoft.Extensions.Caching.Memory;
using Server.Adapters.Driven.MemoryCache;
using MsMemoryCache = Microsoft.Extensions.Caching.Memory.MemoryCache;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementContentCacheAdapter))]
public sealed class MeasurementContentCacheAdapterTests
{
    private const string MeasurementId = "measurement-1";
    private const string OtherMeasurementId = "measurement-2";

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
}
