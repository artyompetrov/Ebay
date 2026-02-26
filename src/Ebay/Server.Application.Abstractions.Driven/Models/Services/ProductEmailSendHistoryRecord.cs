namespace Server.Application.Abstractions.Driven.Models.Services;

public sealed record ProductEmailSendHistoryRecord(
    Guid ProductId,
    string Seller,
    string Link,
    string? Contact,
    string Marketplace,
    bool IsAmbiguous,
    DateTime CreatedAt,
    int? Id = null);
