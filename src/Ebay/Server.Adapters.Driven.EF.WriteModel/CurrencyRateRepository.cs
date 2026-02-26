using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Services;
using Server.Application.Data;

namespace Server.Adapters.Driven.EF.WriteModel;

public class CurrencyRateRepository : ICurrencyRateRepository
{
    private readonly ApplicationDbContext _dbContext;

    public CurrencyRateRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task UpdateRatesAsync(
        IReadOnlyDictionary<string, double> ratesByCurrencyEbayName,
        DateTime updateTimeUtc,
        CancellationToken cancellationToken)
    {
        var currencies = await _dbContext.Currencies
            .Where(x => ratesByCurrencyEbayName.Keys.Contains(x.CurrencyEbayName))
            .ToListAsync(cancellationToken);

        foreach (var currency in currencies)
        {
            currency.CurrencyRate = ratesByCurrencyEbayName[currency.CurrencyEbayName];
            currency.LastUpdate = updateTimeUtc;
        }

        _ = await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
