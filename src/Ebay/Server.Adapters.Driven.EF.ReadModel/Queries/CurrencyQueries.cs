using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models.Services;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class CurrencyQueries : ICurrencyQueries
{
    private readonly ReadDbContext _readDbContext;

    public CurrencyQueries(ReadDbContext readDbContext)
    {
        _readDbContext = readDbContext;
    }

    public async Task<IReadOnlyCollection<CurrencyInfoRecord>> GetCurrenciesAsync(CancellationToken cancellationToken)
    {
        return await _readDbContext.Currencies
            .Select(x => new CurrencyInfoRecord(x.CurrencyApiName, x.CurrencyEbayName))
            .ToListAsync(cancellationToken);
    }
}
