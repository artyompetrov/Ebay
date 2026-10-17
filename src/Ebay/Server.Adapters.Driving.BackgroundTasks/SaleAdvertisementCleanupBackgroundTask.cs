using Microsoft.Extensions.Logging;
using Server.Application.SaleAdvertisements;

namespace Server.Adapters.Driving.BackgroundTasks;

internal sealed class SaleAdvertisementCleanupBackgroundTask : BackgroundTask
{
    private readonly SaleAdvertisementCleanupService _cleanupService;

    public SaleAdvertisementCleanupBackgroundTask(
        ILogger<SaleAdvertisementCleanupBackgroundTask> logger,
        SaleAdvertisementCleanupService cleanupService)
        : base(logger)
    {
        _cleanupService = cleanupService;
    }

    public override TimeSpan UpdateTime => WellKnown.SaleAdvertisements.UpdateTime;
    public override TimeSpan ErrorDelay => WellKnown.SaleAdvertisements.ErrorDelay;

    protected override async Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {

        await _cleanupService.RemoveStaleAdvertisementsAsync(cancellationToken);
    }
}
