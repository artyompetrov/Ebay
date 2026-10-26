using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Application.Currencies;

/// <summary>
/// Adds the currencies the application cannot work without when they are missing, so that a fresh database
/// (a local run, a new deployment) has the base and target currencies and the usual lot currencies.
/// </summary>
public class DefaultCurrencyService
{
    /// <summary>
    /// Date of the placeholder rates: shows on the currency page that the rate has never been refreshed.
    /// </summary>
    public static readonly DateTimeOffset PlaceholderRateDate = DateTimeOffset.UnixEpoch;

    /// <summary>
    /// Default currencies with approximate rates (units per one US dollar); the rate refresh replaces them.
    /// </summary>
    public static readonly IReadOnlyList<DefaultCurrency> Defaults =
    [
        new(Currency.BaseCurrencyId, "Доллар США", 1),
        new(WellKnown.CurrencyRate.TargetCurrency, "Российский рубль", 80),
        new("EUR", "Евро", 0.9),
        new("GBP", "Фунт стерлингов", 0.78),
        new("AUD", "Австралийский доллар", 1.5),
        new("CAD", "Канадский доллар", 1.37),
        new("KZT", "Казахстанский тенге", 500),
    ];

    private readonly ILogger<DefaultCurrencyService> _logger;
    private readonly ICurrencyRepository _currencyRepository;
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;

    /// <summary>
    /// Creates the service.
    /// </summary>
    public DefaultCurrencyService(
        ILogger<DefaultCurrencyService> logger,
        ICurrencyRepository currencyRepository,
        IWriteModelUnitOfWorkFactory unitOfWorkFactory)
    {
        _logger = logger;
        _currencyRepository = currencyRepository;
        _unitOfWorkFactory = unitOfWorkFactory;
    }

    /// <summary>
    /// Adds every default currency that is missing; existing currencies are left as they are.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    public async Task AddMissingDefaultCurrenciesAsync(CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        foreach (var currency in Defaults)
        {
            if (await _currencyRepository.GetByIdAsync(unitOfWork, currency.Id, cancellationToken) is not null)
            {
                continue;
            }

            await _currencyRepository.AddAsync(
                unitOfWork,
                Currency.Create(
                    currencyEbayName: currency.Id,
                    currencyRusName: currency.RusName,
                    currencyApiName: currency.Id,
                    currencyRate: currency.PlaceholderRate,
                    lastUpdate: PlaceholderRateDate),
                cancellationToken);
            _logger.LogInformation("Default currency {CurrencyId} is created with a placeholder rate", currency.Id);
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// A default currency: its ISO code (used both as the eBay and the rate-source name), Russian name and
    /// approximate rate per one US dollar.
    /// </summary>
    public sealed record DefaultCurrency(string Id, string RusName, double PlaceholderRate);
}
