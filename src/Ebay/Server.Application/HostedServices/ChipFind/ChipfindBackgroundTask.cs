using Microsoft.Extensions.Logging;
using Server.Application.Infrastructure;

namespace Server.Application.HostedServices.ChipFind;

public class ChipfindBackgroundTask : BackgroundTask
{
    private readonly ILogger<ChipfindBackgroundTask> _logger;
    private readonly IChipfindAdapter _chipfindAdapter;

    public ChipfindBackgroundTask(
        ILogger<ChipfindBackgroundTask> logger,
        IChipfindAdapter chipfindAdapter
    ) : base(logger)
    {
        _logger = logger;
        _chipfindAdapter = chipfindAdapter;
    }

    public override TimeSpan UpdateTime => WellKnown.ChipFind.UpdateTime;
    public override TimeSpan ErrorDelay => WellKnown.ChipFind.ErrorDelay;

    protected async override Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        var recentSales = await _chipfindAdapter.GetRecentSaleAdvertisements(cancellationToken);
    }
}