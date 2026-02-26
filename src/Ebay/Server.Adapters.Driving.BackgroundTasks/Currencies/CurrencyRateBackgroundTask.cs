using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Adapters.Driving.BackgroundTasks.Infrastructure;
using Server.Application.HostedServices.Currencies;

namespace Server.Adapters.Driving.BackgroundTasks.Currencies;

public class CurrencyRateBackgroundTask : BackgroundTask
{
    private readonly ILogger<CurrencyRateBackgroundTask> _logger;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public CurrencyRateBackgroundTask(
        ILogger<CurrencyRateBackgroundTask> logger,
        IServiceScopeFactory serviceScopeFactory)
        : base(logger)
    {
        _logger = logger;
        _serviceScopeFactory = serviceScopeFactory;
    }

    public override TimeSpan UpdateTime => TimeSpan.FromHours(12);
    public override TimeSpan ErrorDelay => TimeSpan.FromMinutes(5);

    protected override async Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Refreshing currency rates");
        using var scope = _serviceScopeFactory.CreateScope();
        var service = scope.ServiceProvider.GetRequiredService<CurrencyRateRefreshService>();
        await service.RefreshAsync(cancellationToken);
    }
}
