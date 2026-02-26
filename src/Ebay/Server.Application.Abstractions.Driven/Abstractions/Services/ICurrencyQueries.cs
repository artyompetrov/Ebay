using Server.Application.Abstractions.Driven.Models.Services;

namespace Server.Application.Abstractions.Driven.Abstractions.Services;

public interface ICurrencyQueries
{
    Task<IReadOnlyCollection<CurrencyInfoRecord>> GetCurrenciesAsync(CancellationToken cancellationToken);
}
