using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Server.Adapters.Driven.ScrapingProxy;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.NewAudioPortal;

public static class ServiceCollectionExtensions
{
    public static void AddNewAudioPortalAdapter(this IServiceCollection services)
    {
        services.AddOptions<NewAudioPortalAdapterOptions>()
            .BindConfiguration(NewAudioPortalAdapterOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        // Singleton: процессный кеш собранных объявлений тем; свой keyed-экземпляр, чтобы лимиты и вытеснение
        // других кешей процесса не задевали его записи.
        services.AddKeyedSingleton<IMemoryCache, MemoryCache>(WellKnown.CacheServiceKey);
        services.AddScrapingProxyOptions();
        services.AddHttpClient(WellKnown.HttpClientName, static client => client.DefaultRequestHeaders.UserAgent.ParseAdd(WellKnown.UserAgent))
            .UseScrapingProxy();
        services.AddSingleton<ISaleAdvertisementAdapter, NewAudioPortalAdapter>();
    }
}
