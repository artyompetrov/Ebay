using OneOf;
using OneOf.Types;
using OpenExchangeRates;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.OpenExchangeRates;

internal sealed class OpenExchangeRatesCurrencyRateSource : ICurrencyRateSource
{
    private const string AppId = "2d0b695db0cb4dbab40a85a91a88bd24";

    public async Task<OneOf<IReadOnlyDictionary<string, double>, Error<string>>> GetLatestRatesAsync(
        string baseCurrency,
        IEnumerable<string> currencyApiNames,
        CancellationToken cancellationToken)
    {
        using var client = new OpenExchangeRatesClient(AppId);

        var response = await client.GetLatestRatesAsync(
            baseCurrency: baseCurrency,
            currencies: currencyApiNames,
            cancellationToken: cancellationToken);

        if (response is null)
        {
            return new Error<string>("OpenExchangeRates returned no response");
        }

        return response.Rates.ToDictionary(x => x.Key, x => decimal.ToDouble(x.Value));
    }
}
