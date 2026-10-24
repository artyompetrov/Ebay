namespace Server.Domain.SaleAdvertisements;

/// <summary>
/// Оценочная цена товара за единицу, округлённая до целых единиц валюты.
/// </summary>
public sealed record EstimatedPrice
{
    private EstimatedPrice(double amount, string currencyId)
    {
        Amount = amount;
        CurrencyId = currencyId;
    }

    /// <summary>
    /// Сумма в целых единицах валюты.
    /// </summary>
    public double Amount { get; }

    /// <summary>
    /// Код валюты суммы.
    /// </summary>
    public string CurrencyId { get; }

    /// <summary>
    /// Переводит среднюю выручку в долларах в целевую валюту, а без курса оставляет её в долларах.
    /// </summary>
    /// <param name="amountUsd">Сумма в долларах.</param>
    /// <param name="targetRate">Курс целевой валюты или <see langword="null"/>, если его нет.</param>
    public static EstimatedPrice FromUsd(double amountUsd, ExchangeRate? targetRate)
    {
        var (amount, currencyId) = targetRate is { } rate
            ? (amountUsd * rate.UnitsPerUsd, rate.CurrencyId)
            : (amountUsd, Currency.BaseCurrencyId);

        return new EstimatedPrice(Math.Round(amount, MidpointRounding.AwayFromZero), currencyId);
    }
}
