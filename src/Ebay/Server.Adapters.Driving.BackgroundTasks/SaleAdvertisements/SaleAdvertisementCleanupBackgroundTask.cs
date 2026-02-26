using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Adapters.Driving.BackgroundTasks.Infrastructure;
using Server.Application.HostedServices.SaleAdvertisements;

namespace Server.Adapters.Driving.BackgroundTasks.SaleAdvertisements;

public class SaleAdvertisementCleanupBackgroundTask : BackgroundTask
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public SaleAdvertisementCleanupBackgroundTask(
        ILogger<SaleAdvertisementCleanupBackgroundTask> logger,
        IServiceScopeFactory serviceScopeFactory)
        : base(logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public override TimeSpan UpdateTime => TimeSpan.FromDays(1);
    public override TimeSpan ErrorDelay => TimeSpan.FromMinutes(5);

    protected override async Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var service = scope.ServiceProvider.GetRequiredService<SaleAdvertisementCleanupService>();
        await service.CleanupAsync(cancellationToken);
    }
}
