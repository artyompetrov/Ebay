namespace Server.Application.Abstractions.Driven.Abstractions.Services;

public interface ICurrencyRateRepository : IRepository
{
    Task UpdateRatesAsync(
        IReadOnlyDictionary<string, double> ratesByCurrencyEbayName,
        DateTime updateTimeUtc,
        CancellationToken cancellationToken);
}
