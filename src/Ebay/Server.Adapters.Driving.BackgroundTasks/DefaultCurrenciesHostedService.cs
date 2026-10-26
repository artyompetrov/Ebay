using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Server.Application.Currencies;

namespace Server.Adapters.Driving.BackgroundTasks;

/// <summary>
/// Adds the missing default currencies on start. Registered before <see cref="CurrencyRateBackgroundTask" />, and
/// <see cref="StartAsync" /> completes before the next hosted service starts, so the first rate refresh sees them.
/// </summary>
internal sealed class DefaultCurrenciesHostedService : IHostedService
{
    private readonly DefaultCurrencyService _defaultCurrencyService;
    private readonly ILogger<DefaultCurrenciesHostedService> _logger;

    public DefaultCurrenciesHostedService(
        DefaultCurrencyService defaultCurrencyService,
        ILogger<DefaultCurrenciesHostedService> logger)
    {
        _defaultCurrencyService = defaultCurrencyService;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            await BackgroundJobTracing.RunAsync(
                nameof(DefaultCurrenciesHostedService), _defaultCurrencyService.AddMissingDefaultCurrenciesAsync, cancellationToken);
        }
        // A failure here (e.g. the database is briefly unavailable) must not stop the application from starting: the
        // existing currencies keep working, and the next start adds the missing ones.
        catch (Exception e) when (e.IsNotIntendedCancellation(cancellationToken))
        {
            _logger.LogError(e, "Default currencies were not added");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
