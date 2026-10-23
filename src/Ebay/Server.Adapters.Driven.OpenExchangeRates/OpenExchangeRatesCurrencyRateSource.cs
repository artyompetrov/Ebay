using System.Net.Http.Json;
using OneOf;
using OneOf.Types;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.OpenExchangeRates;

internal sealed class OpenExchangeRatesCurrencyRateSource : ICurrencyRateSource
{
    /// <summary>
    /// Named <see cref="HttpClient"/> of this adapter, created per call so the singleton picks up handler rotation
    /// from <see cref="IHttpClientFactory"/>.
    /// </summary>
    internal const string HttpClientName = "OpenExchangeRates";

    private const string AppId = "2d0b695db0cb4dbab40a85a91a88bd24";
    private const string LatestRatesUrl = "https://openexchangerates.org/api/latest.json";
    private const string CurrencySeparator = ",";

    private readonly IHttpClientFactory _httpClientFactory;

    public OpenExchangeRatesCurrencyRateSource(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<OneOf<IReadOnlyDictionary<string, double>, Error<string>>> GetLatestRatesAsync(
        string baseCurrency,
        IEnumerable<string> currencyApiNames,
        CancellationToken cancellationToken)
    {
        // The app id travels in the query string, which tracing removes from spans.
        var url = $"{LatestRatesUrl}?app_id={AppId}"
                  + $"&base={Uri.EscapeDataString(baseCurrency)}"
                  + $"&symbols={Uri.EscapeDataString(string.Join(CurrencySeparator, currencyApiNames))}";

        using var response = await _httpClientFactory.CreateClient(HttpClientName).GetAsync(url, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            return new Error<string>($"OpenExchangeRates answered {(int)response.StatusCode} ({response.StatusCode})");
        }

        var latestRates = await response.Content.ReadFromJsonAsync<LatestRatesResponse>(cancellationToken);
        if (latestRates?.Rates is null)
        {
            return new Error<string>("OpenExchangeRates returned no rates");
        }

        return latestRates.Rates;
    }

    private sealed record LatestRatesResponse(Dictionary<string, double>? Rates);
}
