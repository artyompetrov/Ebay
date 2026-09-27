namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Информация о валюте.
/// </summary>
public record CurrencyInfo(
    string CurrencyEbayName,
    string CurrencyRusName,
    string CurrencyApiName,
    double CurrencyRate,
    DateTimeOffset LastUpdate
);
