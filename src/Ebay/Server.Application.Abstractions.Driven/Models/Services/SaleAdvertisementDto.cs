namespace Server.Application.Abstractions.Driven.Models.Services;

public sealed record SaleAdvertisementDto(
    string Title,
    string Seller,
    DateTime Date,
    Uri Link,
    string[] Items,
    string Body);
