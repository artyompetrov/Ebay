namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Объявление о продаже, полученное из ленты стороннего маркетплейса.
/// </summary>
public record SaleAdvertisement(string Title, string Seller, DateTimeOffset Date, Uri Link, string[] Items, string Body);
