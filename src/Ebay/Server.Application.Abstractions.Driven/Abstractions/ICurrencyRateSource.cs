using OneOf;
using OneOf.Types;

namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Порт для получения актуальных курсов валют из внешнего источника.
/// </summary>
public interface ICurrencyRateSource
{
    /// <summary>
    /// Возвращает курсы запрошенных валют относительно базовой валюты, индексированные по наименованию валюты в источнике;
    /// <see cref="Error{T}"/> с описанием, если источник не вернул курсы.
    /// </summary>
    Task<OneOf<IReadOnlyDictionary<string, double>, Error<string>>> GetLatestRatesAsync(
        string baseCurrency,
        IEnumerable<string> currencyApiNames,
        CancellationToken cancellationToken);
}
