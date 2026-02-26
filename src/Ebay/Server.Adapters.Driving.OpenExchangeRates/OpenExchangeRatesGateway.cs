using OpenExchangeRates;
using Server.Application.Abstractions.Driven.Abstractions.Services;

namespace Server.Adapters.Driving.OpenExchangeRates;

public class OpenExchangeRatesGateway : ICurrencyRatesGateway
{
    private const string AppId = "2d0b695db0cb4dbab40a85a91a88bd24";

    public async Task<IReadOnlyDictionary<string, double>> GetLatestRatesAsync(
        string baseCurrency,
        IReadOnlyCollection<string> currencies,
        CancellationToken cancellationToken)
    {
        using var client = new OpenExchangeRatesClient(AppId);
        var response = await client.GetLatestRatesAsync(
            baseCurrency: baseCurrency,
            currencies: currencies,
            cancellationToken: cancellationToken) ?? throw new InvalidOperationException("Server returned null response");

        return response.Rates.ToDictionary(x => x.Key, x => decimal.ToDouble(x.Value));
    }
}
