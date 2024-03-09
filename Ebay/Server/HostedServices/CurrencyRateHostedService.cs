using Ebay.Server.Data;
using Ebay.Server.Data.Models;
using Ebay.Server.Infrastructure;
using Microsoft.EntityFrameworkCore;
using OpenExchangeRates;

namespace Ebay.Server.HostedServices;

public class CurrencyRateHostedService : IHostedService, IDisposable
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<CurrencyRateHostedService> _logger;

    public CurrencyRateHostedService(
        IServiceScopeFactory serviceScopeFactory,
        ILogger<CurrencyRateHostedService> logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
    }

    private State? _state;

    private record struct State(Task Task, CancellationTokenSource Cts);

    public Task StartAsync(CancellationToken cancellationToken)
    {
        var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);

        var backgroundTask = Task.Run(
            async () =>
            {
                try
                {
                    await RefreshCurrencyRatesForever(cts.Token);
                }
                catch (Exception e) when (!e.IsIntendedOperationCanceledException(cts.Token))
                {
                    _logger.LogError(e, message: $"{nameof(RefreshCurrencyRatesForever)} finished with error");
                }
                finally
                {
                    _logger.LogInformation(message: $"{nameof(RefreshCurrencyRatesForever)} stopped working");
                }
            },
            cancellationToken: cancellationToken);

        _state = new State(Task: backgroundTask, Cts: cts);

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        StopTaskAndDispose();
        _logger.LogInformation(message: $"{nameof(CurrencyRateHostedService)} stopped working");
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        StopTaskAndDispose();
    }

    private void StopTaskAndDispose()
    {
        if (_state == null) return;

        _state.Value.Cts.Cancel();

        try
        {
            _state.Value.Task.GetAwaiter().GetResult();
        }
        catch (Exception e)
        {
            if (!e.IsIntendedOperationCanceledException(_state.Value.Cts.Token))
            {
                _logger.LogError(exception: e, message: "Error while stopping background service");
            }
        }

        _state.Value.Cts.Dispose();
        _state.Value.Task.Dispose();

        _state = null;
    }

    private async Task RefreshCurrencyRatesForever(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                await RefreshCurrencyRates(cancellationToken);

                await Task.Delay(delay: WellKnown.CurrencyRate.UpdateTime, cancellationToken: cancellationToken);
            }
            catch (Exception e) when (!e.IsIntendedOperationCanceledException(cancellationToken))
            {
                _logger.LogError(exception: e, message: "Error while refreshing currency rates");

                await Task.Delay(delay: WellKnown.CurrencyRate.ErrorDelay, cancellationToken: cancellationToken);
            }
        }
    }

    private Task RefreshCurrencyRates(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
        //todo зарегистрировать второй токен для дебаг режима
#if !DEBUG
        _logger.LogInformation("Refreshing currency rates");
        using var scope = _serviceScopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var currencies = await dbContext.Currencies
            .Select(x => new { x.CurrencyApiName, x.CurrencyEbayName })
            .ToListAsync(cancellationToken);

        using var client = new OpenExchangeRatesClient(WellKnown.CurrencyRate.AppId);

        var response = await client.GetLatestRatesAsync(
            baseCurrency: WellKnown.CurrencyRate.BaseCurrency,
            currencies: currencies.Select(x => x.CurrencyApiName),
            cancellationToken: cancellationToken);

        if (response == null) throw new InvalidOperationException("Server returned null response");

        var currencyByApiName = currencies.ToDictionary(x => x.CurrencyApiName);

        var currentTime = DateTime.UtcNow;
        foreach (var (apiCurrencyName, value) in response.Rates)
        {
            var currency = currencyByApiName[apiCurrencyName];

            var dbProduct =
                dbContext.Currencies.Attach(new Currency() { CurrencyEbayName = currency.CurrencyEbayName });
            dbProduct.Entity.CurrencyRate = decimal.ToDouble(value);
            dbProduct.Entity.LastUpdate = currentTime;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
#endif
    }
}