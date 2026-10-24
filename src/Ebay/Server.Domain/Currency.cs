using Server.Domain.Abstractions;

namespace Server.Domain;

public sealed class Currency : AggregateRoot<string>
{
    /// <summary>
    /// Базовая валюта: курсы всех валют хранятся как цена одной её единицы.
    /// </summary>
    public const string BaseCurrencyId = "USD";

    private Currency(string id, string currencyRusName, string currencyApiName, double currencyRate, DateTimeOffset lastUpdate)
        : base(id)
    {
        CurrencyRusName = currencyRusName;
        CurrencyApiName = currencyApiName;
        CurrencyRate = currencyRate;
        LastUpdate = lastUpdate;
    }

    public string CurrencyRusName { get; private set; }

    public string CurrencyApiName { get; private set; }

    /// <summary>
    /// Цена одного доллара в данной валюте.
    /// </summary>
    public double CurrencyRate { get; private set; }

    public DateTimeOffset LastUpdate { get; private set; }

    public static Currency Create(string currencyEbayName, string currencyRusName, string currencyApiName, double currencyRate, DateTimeOffset lastUpdate) =>
        new(currencyEbayName, currencyRusName, currencyApiName, currencyRate, lastUpdate);

    public void UpdateRate(double currencyRate, DateTimeOffset lastUpdate)
    {
        CurrencyRate = currencyRate;
        LastUpdate = lastUpdate;
    }
}
