namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Порт для получения актуальных курсов валют из внешнего источника.
/// </summary>
public interface ICurrencyRateSource
{
    /// <summary>
    /// Возвращает курсы запрошенных валют относительно базовой валюты, индексированные по наименованию валюты в источнике.
    /// </summary>
    Task<IReadOnlyDictionary<string, double>> GetLatestRatesAsync(
        string baseCurrency,
        IEnumerable<string> currencyApiNames,
        CancellationToken cancellationToken);
}
