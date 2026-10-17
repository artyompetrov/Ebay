using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.GeoIp;

public static class ServiceCollectionExtensions
{
    private const int GeoIpRequestTimeoutSeconds = 2;

    public static void AddGeoIpAdapter(this IServiceCollection services)
    {
        // Singleton: процессный кеш адаптера; свой keyed-экземпляр, чтобы лимиты и вытеснение
        // других кешей процесса не задевали его записи.
        services.AddKeyedSingleton<IMemoryCache, MemoryCache>(WellKnown.CacheServiceKey);
        services.AddHttpClient(GeoIpService.HttpClientName, static c =>
        {
            c.Timeout = TimeSpan.FromSeconds(GeoIpRequestTimeoutSeconds);
        });
        services.AddSingleton<IGeoIpService, GeoIpService>();
    }
}