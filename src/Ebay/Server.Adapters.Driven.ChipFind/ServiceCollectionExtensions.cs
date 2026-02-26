using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions.BackgroundTasks;

namespace Server.Adapters.Driven.ChipFind;

public static class ServiceCollectionExtensions
{
    public static void AddChipFindAdapter(
        this IServiceCollection services)
    {
        _ = services.AddHttpClient();
        _ = services.AddSingleton(new ChipFindAdapterOptions(DelayMilliseconds: 5000));
        _ = services.AddScoped<IChipfindGateway, ChipfindAdapter>();
    }
}