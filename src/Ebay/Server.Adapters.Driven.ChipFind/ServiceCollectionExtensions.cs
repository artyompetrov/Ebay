using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Driven.ScrapingProxy;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.ChipFind;

public static class ServiceCollectionExtensions
{
    public static void AddChipFindAdapter(
        this IServiceCollection services)
    {
        // Singleton: процессный кеш адаптера; свой keyed-экземпляр, чтобы лимиты и вытеснение
        // других кешей процесса не задевали его записи.
        services.AddKeyedSingleton<IMemoryCache, MemoryCache>(WellKnown.CacheServiceKey);
        services.AddScrapingProxy();
        services.AddHttpClient(
                WellKnown.HttpClientName,
                static client => client.DefaultRequestHeaders.UserAgent.ParseAdd(ScrapingProxyDefaults.BrowserUserAgent))
            .UseScrapingProxy();
        services.AddSingleton(new ChipFindAdapterOptions(DelayMilliseconds: 5000));
        services.AddSingleton<ISaleAdvertisementAdapter, ChipfindAdapter>();
    }
}