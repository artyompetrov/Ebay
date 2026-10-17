using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Server.Application.SaleAdvertisements;

namespace Server.Adapters.Driving.BackgroundTasks;

internal sealed class ChipfindBackgroundTask : BackgroundTask
{
    private readonly BackgroundTasksOptions _options;
    private readonly ChipfindMonitoringService _monitoringService;

    public ChipfindBackgroundTask(
        ILogger<ChipfindBackgroundTask> logger,
        IOptions<BackgroundTasksOptions> options,
        ChipfindMonitoringService monitoringService)
        : base(logger)
    {
        _options = options.Value;
        _monitoringService = monitoringService;
    }

    public override TimeSpan UpdateTime => WellKnown.ChipFind.UpdateTime;
    public override TimeSpan ErrorDelay => WellKnown.ChipFind.ErrorDelay;

    protected override async Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        if (_options.IsLocalRun)
        {
            return;
        }

        await _monitoringService.ProcessRecentAdvertisementsAsync(_options.TargetEmail, cancellationToken);
    }
}
