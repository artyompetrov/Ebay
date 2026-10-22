using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;

namespace Tests.Unit.Fakes;

/// <summary>
/// Фейк чтения валют: возвращает заранее заданные курсы.
/// </summary>
internal sealed class StaticCurrencyQueries : ICurrencyQueries
{
    private readonly IReadOnlyDictionary<string, double> _rates;

    public StaticCurrencyQueries(IReadOnlyDictionary<string, double> rates)
    {
        _rates = rates;
    }

    public Task<IReadOnlyList<CurrencyInfo>> GetAllCurrenciesAsync(CancellationToken cancellationToken) => throw new NotSupportedException();

    public Task<IReadOnlyDictionary<string, double>> GetCurrencyRatesAsync(CancellationToken cancellationToken) => Task.FromResult(_rates);
}
