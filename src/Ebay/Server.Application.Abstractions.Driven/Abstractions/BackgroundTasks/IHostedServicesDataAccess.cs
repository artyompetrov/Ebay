using Server.Application.Abstractions.Driven.Models.BackgroundTasks;

namespace Server.Application.Abstractions.Driven.Abstractions.BackgroundTasks;

public interface ICurrencyQueries
{
    Task<IReadOnlyCollection<CurrencyInfoRecord>> GetCurrenciesAsync(CancellationToken cancellationToken);
}

public interface ICurrencyRateRepository
{
    Task UpdateRatesAsync(
        IReadOnlyDictionary<string, double> ratesByCurrencyEbayName,
        DateTime updateTimeUtc,
        CancellationToken cancellationToken);
}

public interface IProductEmailSendHistoryRepository
{
    Task<ProductEmailSendHistoryRecord?> GetByProductAndSellerAsync(
        Guid productId,
        string seller,
        string marketplace,
        CancellationToken cancellationToken);

    Task AddAsync(ProductEmailSendHistoryRecord entity, CancellationToken cancellationToken);

    Task UpdateAsync(ProductEmailSendHistoryRecord entity, CancellationToken cancellationToken);

    Task SaveChangesAsync(CancellationToken cancellationToken);

    Task DeleteCreatedBeforeAsync(DateTime thresholdUtc, CancellationToken cancellationToken);
}
