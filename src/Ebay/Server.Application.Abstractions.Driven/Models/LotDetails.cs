using Server.Domain;

namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Информация о лоте (объявлении о продаже) вместе с историей покупок.
/// </summary>
public record LotDetails(
    long Id,
    Guid ProductId,
    string Name,
    int Pcs,
    int? LotSize,
    string CurrencyId,
    string ShippingCountry,
    double Price,
    double Shipping,
    double ShippingAdditional,
    string Description,
    string? ShortDescription,
    string Condition,
    string? ConditionDescription,
    string Seller,
    string LocatedIn,
    DateTimeOffset TitleChangeDate,
    DateTimeOffset UpdateDate,
    IReadOnlyDictionary<string, string> Categories,
    IReadOnlyList<PurchaseDetails> Purchases,
    LotCalculationResult? CalculationResult
);
