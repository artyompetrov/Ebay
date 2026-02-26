namespace Server.Application.Abstractions.Driven.Models.BackgroundTasks;

public sealed record SaleAdvertisementDto(
    string Title,
    string Seller,
    DateTime Date,
    Uri Link,
    string[] Items,
    string Body);
