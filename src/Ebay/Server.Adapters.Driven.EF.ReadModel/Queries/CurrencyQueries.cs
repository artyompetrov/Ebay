using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class CurrencyQueries : ICurrencyQueries
{
    private readonly IDbContextFactory<ReadDbContext> _dbContextFactory;

    public CurrencyQueries(IDbContextFactory<ReadDbContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }

    public async Task<IReadOnlyList<CurrencyInfo>> GetAllCurrenciesAsync(CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        var currencies = await dbContext.Currencies
            .OrderBy(x => x.Id)
            .ToListAsync(cancellationToken);

        return [.. currencies.Select(x => new CurrencyInfo(x.Id, x.CurrencyRusName, x.CurrencyApiName, x.CurrencyRate, x.LastUpdate))];
    }

    public async Task<IReadOnlyDictionary<string, double>> GetCurrencyRatesAsync(CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        return await dbContext.Currencies.ToDictionaryAsync(x => x.Id, x => x.CurrencyRate, cancellationToken);
    }
}
