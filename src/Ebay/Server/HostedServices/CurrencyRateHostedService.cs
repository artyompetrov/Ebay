using MassTransit;
using Microsoft.EntityFrameworkCore;
using OpenExchangeRates;
using Server.Data;
using Server.Data.Models;
using Server.Infrastructure;

namespace Server.HostedServices;

internal class CurrencyRateHostedService : BackgroundTask
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<CurrencyRateHostedService> _logger;

    public CurrencyRateHostedService(
        IServiceScopeFactory serviceScopeFactory,
        ILogger<CurrencyRateHostedService> logger) : base(logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
    }
    

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
    protected async override Task BackgroundTaskImplementation(CancellationToken cancellationToken)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
    {
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