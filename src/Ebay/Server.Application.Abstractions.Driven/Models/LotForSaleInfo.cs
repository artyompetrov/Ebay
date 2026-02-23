using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Driven.Models;

public sealed record LotForSaleInfo(
    string Id,
    string Name,
    Guid ProductId,
    ProductState ProductState);
