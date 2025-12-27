namespace Server.Application.Abstractions.Queries.Currencies;

public record CurrencyDetailsReadModel(string CurrencyEbayName, string CurrencyRusName, double CurrencyRate, DateTime LastUpdate);