using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.New.Infrastructure;

namespace Server.Application.New.HostedServices.SaleAdvertisements;

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

    public override TimeSpan UpdateTime => WellKnown.SaleAdvertisements.UpdateTime;
    public override TimeSpan ErrorDelay => WellKnown.SaleAdvertisements.ErrorDelay;

    protected override async Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var productEmailSendHistoryRepository = scope.ServiceProvider.GetRequiredService<IProductEmailSendHistoryRepository>();

        var staleThreshold = DateTimeOffset.UtcNow - WellKnown.SaleAdvertisements.RemoveAdvertisementAfter;

        await productEmailSendHistoryRepository.RemoveOlderThanAsync(staleThreshold, cancellationToken);
    }
}
