using Server.Application.Abstractions.Driven.Models.Services;

namespace Server.Application.Abstractions.Driven.Abstractions.Queries;

public interface ICurrencyQueries
{
    Task<IReadOnlyCollection<CurrencyInfoRecord>> GetCurrenciesAsync(CancellationToken cancellationToken);
}
