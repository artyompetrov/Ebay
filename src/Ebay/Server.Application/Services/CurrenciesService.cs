using Server.Application.Abstractions.Services;
using Server.Domain;

namespace Server.Application.Services;

internal class CurrenciesService : ICurrenciesService
{
    public async Task<ICollection<Currency>> GetCurrencies()
    {

        return
        [
            .. (await _applicationContext.Currencies
                .AsNoTracking()
                .OrderBy(x => x.CurrencyEbayName)
                .ToListAsync(cancellationToken))
            .Select(x => x.ToApiCurrency())
        ];

    }
}