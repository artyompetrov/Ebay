namespace Server.Domain.SaleAdvertisements;

/// <summary>
/// Товар, совпавший со строкой объявления, и итог учёта этого совпадения.
/// </summary>
/// <param name="ProductId">Идентификатор товара.</param>
/// <param name="Name">Название товара.</param>
/// <param name="RevenueAvgUsd">Средняя выручка за единицу в USD.</param>
/// <param name="QuantityTotal">Количество проданных единиц, по которым посчитана выручка.</param>
/// <param name="IsInteresting">Товар интересен для закупки.</param>
/// <param name="IsNewlyRecorded">Это совпадение впервые учло товар для продавца на маркетплейсе.</param>
public sealed record SaleAdvertisementProductMatch(
    Guid ProductId,
    string Name,
    double RevenueAvgUsd,
    int QuantityTotal,
    bool IsInteresting,
    bool IsNewlyRecorded);
