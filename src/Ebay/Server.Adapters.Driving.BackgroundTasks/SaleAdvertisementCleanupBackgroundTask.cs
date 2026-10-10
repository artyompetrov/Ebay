using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Application.SaleAdvertisements;

namespace Server.Adapters.Driving.BackgroundTasks;

internal sealed class SaleAdvertisementCleanupBackgroundTask : BackgroundTask
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public SaleAdvertisementCleanupBackgroundTask(
        ILogger<SaleAdvertisementCleanupBackgroundTask> logger,
        IServiceScopeFactory serviceScopeFactory)
        : base(logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public override TimeSpan UpdateTime => WellKnown.SaleAdvertisements.UpdateTime;
    public override TimeSpan ErrorDelay => WellKnown.SaleAdvertisements.ErrorDelay;

    protected override async Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var cleanupService = scope.ServiceProvider.GetRequiredService<SaleAdvertisementCleanupService>();

        await cleanupService.RemoveStaleAdvertisementsAsync(cancellationToken);
    }
}
