using Microsoft.Extensions.DependencyInjection;
using Server.Application.HostedServices.ChipFind;

namespace Server.Adapters.ChipFind;

public static class ServiceCollectionExtensions
{
    public static void AddChipFindAdapter(
        this IServiceCollection services)
    {
        services.AddHttpClient();
        services.AddSingleton<ChipFindAdapterOptions>(new ChipFindAdapterOptions(DelayMilliseconds: 5000));
        services.AddScoped<IChipfindAdapter, ChipfindAdapter>();
    }
}