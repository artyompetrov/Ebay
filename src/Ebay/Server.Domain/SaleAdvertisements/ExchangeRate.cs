namespace Server.Domain.SaleAdvertisements;

/// <summary>
/// Курс валюты относительно базовой (<see cref="Currency.BaseCurrencyId"/>).
/// </summary>
/// <param name="CurrencyId">Код валюты, например <c>RUB</c>.</param>
/// <param name="UnitsPerUsd">Сколько единиц валюты стоит один доллар.</param>
public sealed record ExchangeRate(string CurrencyId, double UnitsPerUsd);
