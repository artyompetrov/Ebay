namespace Server.Application.Abstractions.Queries;

public sealed record SaleLotInfo(
    string Id,
    string Name,
    DateTime CreatedAt,
    DateTime ChangedAt);
