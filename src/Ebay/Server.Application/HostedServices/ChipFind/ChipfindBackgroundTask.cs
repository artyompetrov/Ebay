using Microsoft.Extensions.Logging;
using Server.Application.Infrastructure;

namespace Server.Application.HostedServices.ChipFind;

public class ChipfindBackgroundTask : BackgroundTask
{
    private readonly ILogger<ChipfindBackgroundTask> _logger;
    private readonly IChipfindAdapter _chipfindAdapter;
    private readonly IEmailSender _emailSender;
    private readonly EbayServerOptions _ebayServerOptions;

    public ChipfindBackgroundTask(
        ILogger<ChipfindBackgroundTask> logger,
        IChipfindAdapter chipfindAdapter,
        IEmailSender emailSender,
        EbayServerOptions ebayServerOptions
    ) : base(logger)
    {
        _logger = logger;
        _chipfindAdapter = chipfindAdapter;
        _emailSender = emailSender;
        _ebayServerOptions = ebayServerOptions;
    }

    public override TimeSpan UpdateTime => WellKnown.ChipFind.UpdateTime;
    public override TimeSpan ErrorDelay => WellKnown.ChipFind.ErrorDelay;

    protected async override Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        if (_ebayServerOptions.IsLocalRun) return;
        
        var recentSales = await _chipfindAdapter.GetRecentSaleAdvertisements(cancellationToken);

        foreach (var saleAdvertisement in recentSales)
        {
            await _emailSender.Send(targetAddress: _ebayServerOptions.TargetEmail,
                topic: $"{saleAdvertisement.Title} [{saleAdvertisement.Seller}]", messageText: saleAdvertisement.Body);
            break;
        }
    }
}