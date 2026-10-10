using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.MemoryCache;

internal sealed class MeasurementContentCacheAdapter : IMeasurementContentCacheAdapter
{
    private readonly IMemoryCache _cache;
    private readonly MeasurementCacheInvalidationRegistry _invalidationRegistry;

    public MeasurementContentCacheAdapter(
        [FromKeyedServices(WellKnown.ImageCacheServiceKey)] IMemoryCache cache,
        MeasurementCacheInvalidationRegistry invalidationRegistry)
    {
        _cache = cache;
        _invalidationRegistry = invalidationRegistry;
    }

    public Task<T?> GetOrCreateAsync<T>(
        string measurementId,
        string key,
        Func<Task<T?>> factory,
        Func<T, long> sizeSelector)
        where T : class =>
        _cache.GetOrCreateAsync(
            key: key,
            factory: factory,
            sizeSelector: sizeSelector,
            invalidationTokenFactory: () => _invalidationRegistry.AcquireToken(measurementId));

    public void Remove(string key) => _cache.Remove(key);

    public void Invalidate(string measurementId) => _invalidationRegistry.Invalidate(measurementId);
}
