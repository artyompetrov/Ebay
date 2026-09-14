using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.GeoIp;

public static class ServiceCollectionExtensions
{
    private const int GeoIpRequestTimeoutSeconds = 2;

    public static void AddGeoIpAdapter(this IServiceCollection services)
    {
        services.AddHttpClient<IGeoIpService, GeoIpService>(c =>
        {
            c.Timeout = TimeSpan.FromSeconds(GeoIpRequestTimeoutSeconds);
        });
    }
}