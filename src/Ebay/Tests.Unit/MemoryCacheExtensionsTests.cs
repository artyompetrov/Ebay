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
}