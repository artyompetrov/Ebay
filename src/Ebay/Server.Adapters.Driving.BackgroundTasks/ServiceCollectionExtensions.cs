using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Adapters.Driving.BackgroundTasks.Infrastructure;
using Server.Application.New.BackgroundTasks;

namespace Server.Adapters.Driving.BackgroundTasks;

public static class ServiceCollectionExtensions
{
    public static void AddBackgroundTasksAdapter(this IServiceCollection services)
    {
        _ = services.AddHostedService(sp => CreateHostedService<CurrencyRateRefreshService>(
            sp,
            BackgroundTaskSchedule.CurrencyUpdateTime,
            BackgroundTaskSchedule.ErrorDelay,
            static (service, token) => service.RefreshAsync(token)));

        _ = services.AddHostedService(sp => CreateHostedService<ChipfindMonitoringService>(
            sp,
            BackgroundTaskSchedule.ChipfindUpdateTime,
            BackgroundTaskSchedule.ErrorDelay,
            static (service, token) => service.ProcessRecentAdvertisementsAsync(token)));

        _ = services.AddHostedService(sp => CreateHostedService<SaleAdvertisementCleanupService>(
            sp,
            BackgroundTaskSchedule.SaleAdvertisementCleanupUpdateTime,
            BackgroundTaskSchedule.ErrorDelay,
            static (service, token) => service.CleanupAsync(token)));
    }

    private static BackgroundTaskRunner<TService> CreateHostedService<TService>(
        IServiceProvider serviceProvider,
        TimeSpan updateTime,
        TimeSpan errorDelay,
        Func<TService, CancellationToken, Task> taskAction)
        where TService : class
    {
        return new BackgroundTaskRunner<TService>(
            serviceProvider.GetRequiredService<ILogger<BackgroundTaskRunner<TService>>>(),
            serviceProvider.GetRequiredService<IServiceScopeFactory>(),
            updateTime,
            errorDelay,
            taskAction);
    }
}
