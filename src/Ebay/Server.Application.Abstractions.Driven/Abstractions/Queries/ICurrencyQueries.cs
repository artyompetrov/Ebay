using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driven.Abstractions.Queries;

/// <summary>
/// Порт чтения данных валют.
/// </summary>
public interface ICurrencyQueries
{
    /// <summary>
    /// Возвращает список всех валют.
    /// </summary>
    Task<IReadOnlyList<CurrencyInfo>> GetAllCurrenciesAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает курсы всех валют, индексированные по наименованию валюты на eBay.
    /// </summary>
    Task<IReadOnlyDictionary<string, double>> GetCurrencyRatesAsync(CancellationToken cancellationToken);
}
