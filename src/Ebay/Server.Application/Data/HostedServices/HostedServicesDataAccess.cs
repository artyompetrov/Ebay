using Microsoft.EntityFrameworkCore;
using Server.Application.Data;
using Server.Domain;

namespace Server.Application.Data.HostedServices;

public record CurrencyInfo(string CurrencyApiName, string CurrencyEbayName);

public interface ICurrencyQueries
{
    Task<IReadOnlyCollection<CurrencyInfo>> GetCurrenciesAsync(CancellationToken cancellationToken);
}

public interface ICurrencyRateRepository
{
    Task UpdateRatesAsync(IReadOnlyDictionary<string, double> ratesByCurrencyEbayName, DateTime updateTimeUtc, CancellationToken cancellationToken);
}

public interface IProductEmailSendHistoryRepository
{
    Task<ProductEmailSendHistory?> GetByProductAndSellerAsync(Guid productId, string seller, string marketplace, CancellationToken cancellationToken);
    Task AddAsync(ProductEmailSendHistory entity, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
    Task DeleteCreatedBeforeAsync(DateTime thresholdUtc, CancellationToken cancellationToken);
}

public class CurrencyDataAccess : ICurrencyQueries, ICurrencyRateRepository
{
    private readonly ApplicationDbContext _dbContext;

    public CurrencyDataAccess(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<CurrencyInfo>> GetCurrenciesAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Currencies
            .Select(x => new CurrencyInfo(x.CurrencyApiName, x.CurrencyEbayName))
            .ToListAsync(cancellationToken);
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

public class ProductEmailSendHistoryRepository : IProductEmailSendHistoryRepository
{
    private readonly ApplicationDbContext _dbContext;

    public ProductEmailSendHistoryRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<ProductEmailSendHistory?> GetByProductAndSellerAsync(
        Guid productId,
        string seller,
        string marketplace,
        CancellationToken cancellationToken)
    {
        return _dbContext.ProductEmailSendHistory
            .FirstOrDefaultAsync(
                e => e.ProductId == productId && e.Seller == seller && e.Marketplace == marketplace,
                cancellationToken);
    }

    public async Task AddAsync(ProductEmailSendHistory entity, CancellationToken cancellationToken)
    {
        _ = cancellationToken;
        _ = await _dbContext.ProductEmailSendHistory.AddAsync(entity, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        _ = await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task DeleteCreatedBeforeAsync(DateTime thresholdUtc, CancellationToken cancellationToken)
    {
        return _dbContext.ProductEmailSendHistory
            .Where(e => e.CreatedAt < thresholdUtc)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
