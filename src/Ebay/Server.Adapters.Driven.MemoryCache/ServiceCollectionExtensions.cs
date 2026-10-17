using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.Application.Abstractions.Driven.Abstractions;
using MsMemoryCache = Microsoft.Extensions.Caching.Memory.MemoryCache;

namespace Server.Adapters.Driven.MemoryCache;

public static class ServiceCollectionExtensions
{
    public static void AddMemoryCacheAdapter(this IServiceCollection services)
    {
        services.AddOptions<ImageCacheOptions>()
            .BindConfiguration(ImageCacheOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        // Singleton: процессный кеш с собственным лимитом размера, общий для всех запросов.
        services.AddKeyedSingleton<IMemoryCache>(
            WellKnown.ImageCacheServiceKey,
            static (sp, _) => new MsMemoryCache(new MemoryCacheOptions
            {
                SizeLimit = sp.GetRequiredService<IOptions<ImageCacheOptions>>().Value.SizeLimitBytes
            }));
        // Singleton нужен, чтобы токены инвалидации по measurementId были общими для всех запросов процесса, а не per-request.
        services.AddSingleton<MeasurementCacheInvalidationRegistry>();
        services.AddSingleton<IMeasurementContentCacheAdapter, MeasurementContentCacheAdapter>();
    }
}
