using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Services;
using Server.Application.Abstractions.Driven.Models.Services;
using Server.Application.Data;

namespace Server.Adapters.Driven.EF.WriteModel;

public class CurrencyRateRepository : ICurrencyRateRepository
{
    private readonly ApplicationDbContext _dbContext;

    public CurrencyRateRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CurrencyRateRecord?> GetByEbayNameAsync(string currencyEbayName, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Currencies.FirstOrDefaultAsync(x => x.CurrencyEbayName == currencyEbayName, cancellationToken);
        return entity is null ? null : new CurrencyRateRecord(entity.CurrencyEbayName, entity.CurrencyRate, entity.LastUpdate);
    }


    public async Task UpsertAsync(CurrencyRateRecord currencyRate, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Currencies.FirstOrDefaultAsync(
            x => x.CurrencyEbayName == currencyRate.CurrencyEbayName,
            cancellationToken);

        if (entity is null)
        {
            return;
        }

        entity.CurrencyRate = currencyRate.CurrencyRate;
        entity.LastUpdate = currencyRate.LastUpdate;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        return _dbContext.SaveChangesAsync(cancellationToken);
    }
}
