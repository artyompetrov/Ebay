using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Services;
using Server.Application.Abstractions.Driven.Models.Services;
using Server.Application.Data;

namespace Server.Adapters.Driven.EF.WriteModel;

public class CurrencyQueries : ICurrencyQueries
{
    private readonly ApplicationDbContext _dbContext;

    public CurrencyQueries(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<CurrencyInfoRecord>> GetCurrenciesAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Currencies
            .Select(x => new CurrencyInfoRecord(x.CurrencyApiName, x.CurrencyEbayName))
            .ToListAsync(cancellationToken);
    }
}
