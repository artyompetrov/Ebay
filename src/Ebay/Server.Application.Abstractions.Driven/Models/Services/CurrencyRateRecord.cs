namespace Server.Application.Abstractions.Driven.Models.Services;

public sealed record CurrencyRateRecord(string CurrencyEbayName, double CurrencyRate, DateTime LastUpdate);
