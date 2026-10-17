using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.LotForSale;

namespace Server.Application.Currencies;

/// <summary>
/// Сценарий обновления курсов валют из внешнего источника.
/// </summary>
public class CurrencyRateService
{
    private readonly ILogger<CurrencyRateService> _logger;
    private readonly ICurrencyQueries _currencyQueries;
    private readonly ICurrencyRepository _currencyRepository;
    private readonly ICurrencyRateSource _currencyRateSource;
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;
    private readonly ICurrentTimeProvider _currentTimeProvider;

    /// <summary>
    /// Создает сервис обновления курсов валют.
    /// </summary>
    public CurrencyRateService(
        ILogger<CurrencyRateService> logger,
        ICurrencyQueries currencyQueries,
        ICurrencyRepository currencyRepository,
        ICurrencyRateSource currencyRateSource,
        IWriteModelUnitOfWorkFactory unitOfWorkFactory,
        ICurrentTimeProvider currentTimeProvider)
    {
        _logger = logger;
        _currencyQueries = currencyQueries;
        _currencyRepository = currencyRepository;
        _currencyRateSource = currencyRateSource;
        _unitOfWorkFactory = unitOfWorkFactory;
        _currentTimeProvider = currentTimeProvider;
    }

    /// <summary>
    /// Запрашивает актуальные курсы всех известных валют и сохраняет их.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    public async Task RefreshRatesAsync(CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        _logger.LogInformation("Refreshing currency rates");

        var currencies = await _currencyQueries.GetAllCurrenciesAsync(cancellationToken);

        var rates = await _currencyRateSource.GetLatestRatesAsync(
            baseCurrency: WellKnown.CurrencyRate.BaseCurrency,
            currencyApiNames: currencies.Select(static x => x.CurrencyApiName),
            cancellationToken: cancellationToken);

        var currencyByApiName = currencies.ToDictionary(static x => x.CurrencyApiName);

        var currentTime = _currentTimeProvider.UtcNow;
        foreach (var (apiCurrencyName, value) in rates)
        {
            var currency = currencyByApiName[apiCurrencyName];

            var dbCurrency = await _currencyRepository.GetByIdAsync(unitOfWork, currency.CurrencyEbayName, cancellationToken) ??
                              throw new InvalidOperationException($"Currency {currency.CurrencyEbayName} not found");
            dbCurrency.UpdateRate(value, currentTime);
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
