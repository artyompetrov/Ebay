using OpenExchangeRates;
using Server.Application.Data.HostedServices;
using Server.Domain;

namespace Server.Application.HostedServices.Currencies;

public class CurrencyRateRefreshService
{
    private readonly ICurrencyQueries _currencyQueries;
    private readonly ICurrencyRateRepository _currencyRateRepository;
    private readonly EbayServerOptions _options;

    public CurrencyRateRefreshService(
        ICurrencyQueries currencyQueries,
        ICurrencyRateRepository currencyRateRepository,
        EbayServerOptions options)
    {
        _currencyQueries = currencyQueries;
        _currencyRateRepository = currencyRateRepository;
        _options = options;
    }

    public async Task RefreshAsync(CancellationToken cancellationToken)
    {
        if (_options.IsLocalRun)
        {
            return;
        }

        var currencies = await _currencyQueries.GetCurrenciesAsync(cancellationToken);
        using var client = new OpenExchangeRatesClient(WellKnown.CurrencyRate.AppId);

        var response = await client.GetLatestRatesAsync(
            baseCurrency: WellKnown.CurrencyRate.BaseCurrency,
            currencies: currencies.Select(x => x.CurrencyApiName),
            cancellationToken: cancellationToken) ?? throw new InvalidOperationException("Server returned null response");

        var currencyByApiName = currencies.ToDictionary(x => x.CurrencyApiName);
        var ratesByEbayName = response.Rates
            .ToDictionary(x => currencyByApiName[x.Key].CurrencyEbayName, x => decimal.ToDouble(x.Value));

        await _currencyRateRepository.UpdateRatesAsync(ratesByEbayName, DateTime.UtcNow, cancellationToken);
    }
}
