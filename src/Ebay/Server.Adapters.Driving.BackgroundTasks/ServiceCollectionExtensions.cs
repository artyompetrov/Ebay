using Microsoft.Extensions.DependencyInjection;

namespace Server.Adapters.Driving.BackgroundTasks;

public static class ServiceCollectionExtensions
{
    public static void AddBackgroundTasksAdapter(this IServiceCollection services)
    {
        services.AddOptions<BackgroundTasksOptions>()
            .BindConfiguration(BackgroundTasksOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddHostedService<ChipfindBackgroundTask>();
        services.AddHostedService<SaleAdvertisementCleanupBackgroundTask>();
        services.AddHostedService<CurrencyRateBackgroundTask>();
        services.AddHostedService<DbCacheCleanupHostedService>();
        services.AddHostedService<MeasurementPlotWarmupHostedService>();
    }
}
