using AwesomeAssertions;
using Microsoft.Extensions.Caching.Memory;
using Server.Application.New.Caching;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MemoryCacheExtensions))]
public sealed class MemoryCacheExtensionsTests
{
    [Test]
    public async Task GetOrCreateAsync_SecondCall_IsServedFromCache_WithoutInvokingFactoryAgain()
    {
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var factoryCallCount = 0;

        Task<string?> Factory()
        {
            factoryCallCount++;
            return Task.FromResult<string?>("value");
        }

        var first = await cache.GetOrCreateAsync("key", Factory, sizeSelector: static s => s.Length);
        var second = await cache.GetOrCreateAsync("key", Factory, sizeSelector: static s => s.Length);

        first.Should().Be("value");
        second.Should().Be("value");
        factoryCallCount.Should().Be(1);
    }

    [Test]
    public async Task GetOrCreateAsync_DoesNotCache_WhenFactoryReturnsNull()
    {
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var factoryCallCount = 0;

        Task<string?> Factory()
        {
            factoryCallCount++;
            return Task.FromResult<string?>(null);
        }

        await cache.GetOrCreateAsync("key", Factory, sizeSelector: static s => s.Length);
        await cache.GetOrCreateAsync("key", Factory, sizeSelector: static s => s.Length);

        factoryCallCount.Should().Be(2);
    }

    [Test]
    public async Task GetOrCreateAsync_DoesNotRetainEntry_WhenItExceedsSizeLimit()
    {
        using var cache = new MemoryCache(new MemoryCacheOptions { SizeLimit = 10 });
        var factoryCallCount = 0;

        Task<string?> Factory()
        {
            factoryCallCount++;
            return Task.FromResult<string?>(new string('x', 20));
        }

        await cache.GetOrCreateAsync("big", Factory, sizeSelector: static s => s.Length);
        await cache.GetOrCreateAsync("big", Factory, sizeSelector: static s => s.Length);

        factoryCallCount.Should().Be(2);
    }

    [Test]
    public async Task GetOrCreateAsync_EvictsEntryImmediately_WhenInvalidationTokenIsCancelled()
    {
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var registry = new MeasurementCacheInvalidationRegistry();
        var factoryCallCount = 0;

        Task<string?> Factory()
        {
            factoryCallCount++;
            return Task.FromResult<string?>("value");
        }

        await cache.GetOrCreateAsync(
            "key",
            Factory,
            sizeSelector: static s => s.Length,
            invalidationTokenFactory: () => registry.AcquireToken("measurement-1"));

        registry.Invalidate("measurement-1");

        await cache.GetOrCreateAsync("key", Factory, sizeSelector: static s => s.Length);

        factoryCallCount.Should().Be(2);
    }

    [Test]
    public async Task GetOrCreateAsync_DoesNotAcquireInvalidationToken_WhenFactoryReturnsNull()
    {
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var registry = new MeasurementCacheInvalidationRegistry();

        await cache.GetOrCreateAsync(
            "key",
            () => Task.FromResult<string?>(null),
            sizeSelector: static s => s.Length,
            invalidationTokenFactory: () => registry.AcquireToken("missing-measurement"));

        registry.ActiveTokenSourceCount.Should().Be(0);
    }

    [Test]
    public async Task GetOrCreateAsync_DoesNotCacheValue_WhenInvalidationHappensDuringFactory()
    {
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var registry = new MeasurementCacheInvalidationRegistry();
        var factoryCallCount = 0;

        async Task<string?> Factory()
        {
            factoryCallCount++;
            registry.Invalidate("measurement-1");
            await Task.Yield();
            return "value";
        }

        var first = await cache.GetOrCreateAsync(
            "key",
            Factory,
            sizeSelector: static s => s.Length,
            invalidationTokenFactory: () => registry.AcquireToken("measurement-1"));
        var second = await cache.GetOrCreateAsync(
            "key",
            Factory,
            sizeSelector: static s => s.Length,
            invalidationTokenFactory: () => registry.AcquireToken("measurement-1"));

        first.Should().Be("value");
        second.Should().Be("value");
        factoryCallCount.Should().Be(2);
        registry.ActiveTokenSourceCount.Should().Be(0);
    }
}
