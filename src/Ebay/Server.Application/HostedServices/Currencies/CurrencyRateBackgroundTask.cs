using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenExchangeRates;
using Server.Application.Data;
using Server.Application.Infrastructure;
using Server.Domain;

namespace Server.Application.HostedServices.Currencies
{
    public class CurrencyRateBackgroundTask(
        IServiceScopeFactory serviceScopeFactory,
        ILogger<CurrencyRateBackgroundTask> logger,
        EbayServerOptions options) : BackgroundTask(logger)
    {
        private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;
        private readonly ILogger<CurrencyRateBackgroundTask> _logger = logger;
        private readonly EbayServerOptions _options = options;

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
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var currencies = await dbContext.Currencies
                .Select(x => new { x.CurrencyApiName, x.CurrencyEbayName })
                .ToListAsync(cancellationToken);

            using var client = new OpenExchangeRatesClient(WellKnown.CurrencyRate.AppId);

            var response = await client.GetLatestRatesAsync(
                baseCurrency: WellKnown.CurrencyRate.BaseCurrency,
                currencies: currencies.Select(x => x.CurrencyApiName),
                cancellationToken: cancellationToken) ?? throw new InvalidOperationException("Server returned null response");
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

            _ = await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}