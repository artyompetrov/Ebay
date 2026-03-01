using Microsoft.Extensions.DependencyInjection;
using Server.Application.HostedServices.ChipFind;

namespace Server.Adapters.Driven.ChipFind;

public static class ServiceCollectionExtensions
{
    public static void AddChipFindAdapter(
        this IServiceCollection services)
    {
        services.AddHttpClient();
        services.AddSingleton(new ChipFindAdapterOptions(DelayMilliseconds: 5000));
        services.AddScoped<IChipfindAdapter, ChipfindAdapter>();
    }
}