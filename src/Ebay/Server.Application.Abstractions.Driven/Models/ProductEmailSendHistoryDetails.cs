namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Данные записи об отправке письма по объявлению о продаже.
/// </summary>
public record ProductEmailSendHistoryDetails(
    Guid Id,
    Guid ProductId,
    string Seller,
    string Link,
    string Marketplace,
    bool IsAmbiguous,
    DateTimeOffset AdvertisementDate,
    string? Contact);
