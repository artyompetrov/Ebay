using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Server.Application.Currencies;

namespace Server.Adapters.Driving.BackgroundTasks;

internal sealed class CurrencyRateBackgroundTask : BackgroundTask
{
    private readonly CurrencyRateService _currencyRateService;
    private readonly BackgroundTasksOptions _options;

    public CurrencyRateBackgroundTask(
        CurrencyRateService currencyRateService,
        ILogger<CurrencyRateBackgroundTask> logger,
        IOptions<BackgroundTasksOptions> options)
        : base(logger)
    {
        _currencyRateService = currencyRateService;
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

        await _currencyRateService.RefreshRatesAsync(cancellationToken);
    }
}
