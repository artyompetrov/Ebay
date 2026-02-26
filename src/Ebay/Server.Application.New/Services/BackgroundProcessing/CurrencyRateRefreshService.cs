using Server.Application.Abstractions.Driven.Abstractions.Services;

namespace Server.Application.New.Services;

/// <summary>
/// Обновляет курсы валют для фоновой задачи.
/// </summary>
public class CurrencyRateRefreshService : Server.Application.Abstractions.Driving.Abstractions.Services.BackgroundProcessing.ICurrencyRateRefreshService
{
    private readonly ICurrencyQueries _currencyQueries;
    private readonly ICurrencyRateRepository _currencyRateRepository;
    private readonly IBackgroundTaskSettings _settings;
    private readonly ICurrencyRatesGateway _currencyRatesGateway;

    /// <summary>
    /// Создает сервис обновления курсов валют.
    /// </summary>
    public CurrencyRateRefreshService(
        ICurrencyQueries currencyQueries,
        ICurrencyRateRepository currencyRateRepository,
        IBackgroundTaskSettings settings,
        ICurrencyRatesGateway currencyRatesGateway)
    {
        _currencyQueries = currencyQueries;
        _currencyRateRepository = currencyRateRepository;
        _settings = settings;
        _currencyRatesGateway = currencyRatesGateway;
    }

    /// <summary>
    /// Загружает и сохраняет актуальные курсы валют.
    /// </summary>
    public async Task RefreshAsync(CancellationToken cancellationToken)
    {
        if (_settings.IsLocalRun)
        {
            return;
        }

        var currencies = await _currencyQueries.GetCurrenciesAsync(cancellationToken);

        var ratesByApiName = await _currencyRatesGateway.GetLatestRatesAsync(
            baseCurrency: "USD",
            currencies: currencies.Select(x => x.CurrencyApiName).ToArray(),
            cancellationToken: cancellationToken);

        var currencyByApiName = currencies.ToDictionary(x => x.CurrencyApiName);
        var ratesByEbayName = ratesByApiName
            .ToDictionary(x => currencyByApiName[x.Key].CurrencyEbayName, x => x.Value);

        await _currencyRateRepository.UpdateRatesAsync(ratesByEbayName, DateTime.UtcNow, cancellationToken);
    }
}
