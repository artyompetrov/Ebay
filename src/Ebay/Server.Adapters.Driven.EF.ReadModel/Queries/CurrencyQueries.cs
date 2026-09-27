using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class CurrencyQueries : ICurrencyQueries
{
    private readonly ReadDbContext _readDbContext;

    public CurrencyQueries(ReadDbContext readDbContext)
    {
        _readDbContext = readDbContext;
    }

    public async Task<IReadOnlyList<CurrencyInfo>> GetAllCurrenciesAsync(CancellationToken cancellationToken)
    {
        var currencies = await _readDbContext.Currencies
            .OrderBy(x => x.Id)
            .ToListAsync(cancellationToken);

        return [.. currencies.Select(x => new CurrencyInfo(x.Id, x.CurrencyRusName, x.CurrencyApiName, x.CurrencyRate, x.LastUpdate))];
    }

    public async Task<IReadOnlyDictionary<string, double>> GetCurrencyRatesAsync(CancellationToken cancellationToken) =>
        await _readDbContext.Currencies.ToDictionaryAsync(x => x.Id, x => x.CurrencyRate, cancellationToken);
}
