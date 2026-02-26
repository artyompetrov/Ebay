using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Adapters.Driving.BackgroundTasks.Infrastructure;
using Server.Application.HostedServices.ChipFind;

namespace Server.Adapters.Driving.BackgroundTasks.ChipFind;

public class ChipfindBackgroundTask : BackgroundTask
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public ChipfindBackgroundTask(
        ILogger<ChipfindBackgroundTask> logger,
        IServiceScopeFactory serviceScopeFactory)
        : base(logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public override TimeSpan UpdateTime => TimeSpan.FromMinutes(20);
    public override TimeSpan ErrorDelay => TimeSpan.FromMinutes(5);

    protected override async Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var service = scope.ServiceProvider.GetRequiredService<ChipfindMonitoringService>();
        await service.ProcessRecentAdvertisementsAsync(cancellationToken);
    }
}
