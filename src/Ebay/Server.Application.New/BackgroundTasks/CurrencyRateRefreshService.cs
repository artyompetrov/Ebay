using OpenExchangeRates;
using Server.Application.Abstractions.Driven.Abstractions.BackgroundTasks;

namespace Server.Application.New.BackgroundTasks;

/// <summary>
/// Обновляет курсы валют для фоновой задачи.
/// </summary>
public class CurrencyRateRefreshService
{
    private readonly ICurrencyQueries _currencyQueries;
    private readonly ICurrencyRateRepository _currencyRateRepository;
    private readonly IBackgroundTaskSettings _settings;

    /// <summary>
    /// Создает сервис обновления курсов валют.
    /// </summary>
    public CurrencyRateRefreshService(
        ICurrencyQueries currencyQueries,
        ICurrencyRateRepository currencyRateRepository,
        IBackgroundTaskSettings settings)
    {
        _currencyQueries = currencyQueries;
        _currencyRateRepository = currencyRateRepository;
        _settings = settings;
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

        using var client = new OpenExchangeRatesClient(BackgroundTaskSchedule.OpenExchangeRatesAppId);

        var response = await client.GetLatestRatesAsync(
            baseCurrency: BackgroundTaskSchedule.CurrencyBase,
            currencies: currencies.Select(x => x.CurrencyApiName),
            cancellationToken: cancellationToken) ?? throw new InvalidOperationException("Server returned null response");

        var currencyByApiName = currencies.ToDictionary(x => x.CurrencyApiName);
        var ratesByEbayName = response.Rates
            .ToDictionary(x => currencyByApiName[x.Key].CurrencyEbayName, x => decimal.ToDouble(x.Value));

        await _currencyRateRepository.UpdateRatesAsync(ratesByEbayName, DateTime.UtcNow, cancellationToken);
    }
}
