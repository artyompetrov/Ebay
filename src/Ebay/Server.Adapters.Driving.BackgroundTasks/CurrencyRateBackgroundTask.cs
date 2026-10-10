using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Server.Application.Currencies;

namespace Server.Adapters.Driving.BackgroundTasks;

internal sealed class CurrencyRateBackgroundTask : BackgroundTask
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly BackgroundTasksOptions _options;

    public CurrencyRateBackgroundTask(
        IServiceScopeFactory serviceScopeFactory,
        ILogger<CurrencyRateBackgroundTask> logger,
        IOptions<BackgroundTasksOptions> options)
        : base(logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _options = options.Value;
    }

    public override TimeSpan UpdateTime => WellKnown.CurrencyRate.UpdateTime;
    public override TimeSpan ErrorDelay => WellKnown.CurrencyRate.ErrorDelay;

    protected override async Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        if (_options.IsLocalRun)
        {
            return;
        }

        using var scope = _serviceScopeFactory.CreateScope();
        var currencyRateService = scope.ServiceProvider.GetRequiredService<CurrencyRateService>();

        await currencyRateService.RefreshRatesAsync(cancellationToken);
    }
}
