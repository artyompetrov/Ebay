using System.Diagnostics;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.MemoryCache;

internal sealed class MeasurementContentCacheAdapter : IMeasurementContentCacheAdapter
{
    private static readonly ActivitySource ActivitySource = new(WellKnown.Tracing.ActivitySourceName);

    private readonly IMemoryCache _cache;
    private readonly MeasurementCacheInvalidationRegistry _invalidationRegistry;

    public MeasurementContentCacheAdapter(
        [FromKeyedServices(WellKnown.ImageCacheServiceKey)] IMemoryCache cache,
        MeasurementCacheInvalidationRegistry invalidationRegistry)
    {
        _cache = cache;
        _invalidationRegistry = invalidationRegistry;
    }

    public async Task<T?> GetOrCreateAsync<T>(
        string measurementId,
        string key,
        Func<Task<T?>> factory,
        Func<T, long> sizeSelector)
        where T : class
    {
        // Producing the content on a miss (rendering, database reads) runs inside this span.
        using var activity = ActivitySource.StartActivity(WellKnown.Tracing.GetOrCreateSpan);
        activity?.SetTag(WellKnown.Tracing.MeasurementIdTag, measurementId);
        activity?.SetTag(WellKnown.Tracing.CacheKeyTag, key);

        var isCacheHit = true;
        var value = await _cache.GetOrCreateAsync(
            key: key,
            factory: () =>
            {
                isCacheHit = false;
                return factory();
            },
            sizeSelector: sizeSelector,
            invalidationTokenFactory: () => _invalidationRegistry.AcquireToken(measurementId));

        activity?.SetTag(WellKnown.Tracing.CacheHitTag, isCacheHit);
        return value;
    }

    public void Remove(string key) => _cache.Remove(key);

    public void Invalidate(string measurementId) => _invalidationRegistry.Invalidate(measurementId);
}
