namespace Server.Application.Abstractions.Driven.Abstractions.Services;

public interface ICurrencyRatesGateway
{
    Task<IReadOnlyDictionary<string, double>> GetLatestRatesAsync(
        string baseCurrency,
        IReadOnlyCollection<string> currencies,
        CancellationToken cancellationToken);
}
