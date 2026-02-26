using Server.Application.Abstractions.Driven.Models.Services;

namespace Server.Application.Abstractions.Driven.Abstractions.Services;

public interface ICurrencyRateRepository
{
    Task<CurrencyRateRecord?> GetByEbayNameAsync(string currencyEbayName, CancellationToken cancellationToken);

    Task UpsertAsync(CurrencyRateRecord currencyRate, CancellationToken cancellationToken);

    Task SaveChangesAsync(CancellationToken cancellationToken);
}
