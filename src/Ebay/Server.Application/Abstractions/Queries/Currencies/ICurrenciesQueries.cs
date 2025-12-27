using Server.Domain;

namespace Server.Application.Abstractions.Queries.Currencies;

public interface ICurrenciesQueries
{
    public Task<ICollection<CurrencyDetailsReadModel>> GetCurrenciesAsync(CancellationToken cancellationToken);
}