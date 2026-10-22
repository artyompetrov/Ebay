using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Server.Adapters.Driven.ScrapingProxy;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.Qrz;

public static class ServiceCollectionExtensions
{
    public static void AddQrzAdapter(this IServiceCollection services)
    {
        services.AddOptions<QrzAdapterOptions>()
            .BindConfiguration(QrzAdapterOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        // Singleton: процессный кеш разобранных страниц объявлений; свой keyed-экземпляр, чтобы лимиты и вытеснение
        // других кешей процесса не задевали его записи.
        services.AddKeyedSingleton<IMemoryCache, MemoryCache>(WellKnown.CacheServiceKey);
        services.AddScrapingProxyOptions();
        services.AddHttpClient(WellKnown.HttpClientName, static client => client.DefaultRequestHeaders.UserAgent.ParseAdd(WellKnown.UserAgent))
            .UseScrapingProxy();
        services.TryAddSingleton(TimeProvider.System);
        services.AddSingleton<ISaleAdvertisementAdapter, QrzAdapter>();
    }
}
