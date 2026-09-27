using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.New.Infrastructure;

namespace Server.Application.New.HostedServices.Currencies;

public class CurrencyRateBackgroundTask : BackgroundTask
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<CurrencyRateBackgroundTask> _logger;
    private readonly EbayServerOptions _options;

    public CurrencyRateBackgroundTask(
        IServiceScopeFactory serviceScopeFactory,
        ILogger<CurrencyRateBackgroundTask> logger,
        EbayServerOptions options)
        : base(logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
        _options = options;
    }

    public override TimeSpan UpdateTime => WellKnown.CurrencyRate.UpdateTime;
    public override TimeSpan ErrorDelay => WellKnown.CurrencyRate.ErrorDelay;

    protected override async Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        if (_options.IsLocalRun)
        {
            return;
        }

        _logger.LogInformation("Refreshing currency rates");
        using var scope = _serviceScopeFactory.CreateScope();
        var currencyQueries = scope.ServiceProvider.GetRequiredService<ICurrencyQueries>();
        var currencyRepository = scope.ServiceProvider.GetRequiredService<ICurrencyRepository>();
        var currencyRateSource = scope.ServiceProvider.GetRequiredService<ICurrencyRateSource>();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IWriteModelUnitOfWork>();

        var currencies = await currencyQueries.GetAllCurrenciesAsync(cancellationToken);

        var rates = await currencyRateSource.GetLatestRatesAsync(
            baseCurrency: WellKnown.CurrencyRate.BaseCurrency,
            currencyApiNames: currencies.Select(x => x.CurrencyApiName),
            cancellationToken: cancellationToken);

        var currencyByApiName = currencies.ToDictionary(x => x.CurrencyApiName);

        var currentTime = DateTimeOffset.UtcNow;
        foreach (var (apiCurrencyName, value) in rates)
        {
            var currency = currencyByApiName[apiCurrencyName];

            var dbCurrency = await currencyRepository.GetByIdAsync(currency.CurrencyEbayName, cancellationToken) ??
                              throw new InvalidOperationException($"Currency {currency.CurrencyEbayName} not found");
            dbCurrency.UpdateRate(value, currentTime);
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
