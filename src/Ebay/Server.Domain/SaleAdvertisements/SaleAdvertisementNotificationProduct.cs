namespace Server.Domain.SaleAdvertisements;

/// <summary>
/// Товар, совпавший со строкой объявления в уведомлении.
/// </summary>
/// <param name="Name">Название товара.</param>
/// <param name="EstimatedPrice">Оценочная цена за единицу.</param>
/// <param name="QuantityTotal">Количество проданных единиц, по которым посчитана оценка.</param>
/// <param name="IsTriggering">Товар впервые учтён для продавца и интересен, то есть вызвал уведомление.</param>
public sealed record SaleAdvertisementNotificationProduct(
    string Name,
    EstimatedPrice EstimatedPrice,
    int QuantityTotal,
    bool IsTriggering);
