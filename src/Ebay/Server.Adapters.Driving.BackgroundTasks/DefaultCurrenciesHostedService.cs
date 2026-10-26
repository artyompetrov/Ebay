using Microsoft.Extensions.Hosting;
using Server.Application.Currencies;

namespace Server.Adapters.Driving.BackgroundTasks;

/// <summary>
/// Adds the missing default currencies on start. Registered before <see cref="CurrencyRateBackgroundTask" />, and
/// <see cref="StartAsync" /> completes before the next hosted service starts, so the first rate refresh sees them.
/// </summary>
internal sealed class DefaultCurrenciesHostedService : IHostedService
{
    private readonly DefaultCurrencyService _defaultCurrencyService;

    public DefaultCurrenciesHostedService(DefaultCurrencyService defaultCurrencyService)
    {
        _defaultCurrencyService = defaultCurrencyService;
    }

    public Task StartAsync(CancellationToken cancellationToken) =>
        BackgroundJobTracing.RunAsync(
            nameof(DefaultCurrenciesHostedService), _defaultCurrencyService.AddMissingDefaultCurrenciesAsync, cancellationToken);

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
