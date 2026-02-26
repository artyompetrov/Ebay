using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Driving.BackgroundTasks.ChipFind;
using Server.Adapters.Driving.BackgroundTasks.Currencies;
using Server.Adapters.Driving.BackgroundTasks.SaleAdvertisements;

namespace Server.Adapters.Driving.BackgroundTasks;

public static class ServiceCollectionExtensions
{
    public static void AddBackgroundTasksAdapter(this IServiceCollection services)
    {
        _ = services.AddHostedService<CurrencyRateBackgroundTask>();
        _ = services.AddHostedService<ChipfindBackgroundTask>();
        _ = services.AddHostedService<SaleAdvertisementCleanupBackgroundTask>();
    }
}
