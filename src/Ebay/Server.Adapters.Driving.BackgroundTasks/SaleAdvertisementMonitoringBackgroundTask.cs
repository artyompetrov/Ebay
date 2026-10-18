using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Server.Application.SaleAdvertisements;

namespace Server.Adapters.Driving.BackgroundTasks;

internal sealed class SaleAdvertisementMonitoringBackgroundTask : BackgroundTask
{
    private readonly BackgroundTasksOptions _options;
    private readonly SaleAdvertisementMonitoringService _monitoringService;

    public SaleAdvertisementMonitoringBackgroundTask(
        ILogger<SaleAdvertisementMonitoringBackgroundTask> logger,
        IOptions<BackgroundTasksOptions> options,
        SaleAdvertisementMonitoringService monitoringService)
        : base(logger)
    {
        _options = options.Value;
        _monitoringService = monitoringService;
    }

    public override TimeSpan UpdateTime => WellKnown.SaleAdvertisementMonitoring.UpdateTime;
    public override TimeSpan ErrorDelay => WellKnown.SaleAdvertisementMonitoring.ErrorDelay;

    protected override async Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        if (_options.IsLocalRun)
        {
            return;
        }

        await _monitoringService.ProcessRecentAdvertisementsAsync(_options.TargetEmail, cancellationToken);
    }
}
