using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Application.Data;
using Server.Application.Infrastructure;

namespace Server.Application.HostedServices.SaleAdvertisements;

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
        var applicationDbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        using var transaction = TransactionScopeFactory.Create();

        var staleThreshold = DateTime.UtcNow - WellKnown.SaleAdvertisements.RemoveAdvertisementAfter;

        _ = await applicationDbContext.ProductEmailSendHistory
            .Where(e => e.CreatedAt < staleThreshold)
            .ExecuteDeleteAsync(cancellationToken);

        transaction.Complete();
    }
}