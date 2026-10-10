using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Server.Application.SaleAdvertisements;

namespace Server.Adapters.Driving.BackgroundTasks;

internal sealed class ChipfindBackgroundTask : BackgroundTask
{
    private readonly BackgroundTasksOptions _options;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public ChipfindBackgroundTask(
        ILogger<ChipfindBackgroundTask> logger,
        IOptions<BackgroundTasksOptions> options,
        IServiceScopeFactory serviceScopeFactory)
        : base(logger)
    {
        _options = options.Value;
        _serviceScopeFactory = serviceScopeFactory;
    }

    public override TimeSpan UpdateTime => WellKnown.ChipFind.UpdateTime;
    public override TimeSpan ErrorDelay => WellKnown.ChipFind.ErrorDelay;

    protected override async Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        if (_options.IsLocalRun)
        {
            return;
        }

        using var scope = _serviceScopeFactory.CreateScope();
        var monitoringService = scope.ServiceProvider.GetRequiredService<ChipfindMonitoringService>();

        await monitoringService.ProcessRecentAdvertisementsAsync(_options.TargetEmail, cancellationToken);
    }
}
