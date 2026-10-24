namespace Server.Domain.SaleAdvertisements;

/// <summary>
/// Строка объявления в уведомлении со всеми товарами, с которыми она совпала.
/// </summary>
/// <param name="Text">Текст строки объявления.</param>
/// <param name="Products">Совпавшие товары в порядке сопоставления; хотя бы один из них вызвал уведомление.</param>
public sealed record SaleAdvertisementNotificationLine(
    string Text,
    IReadOnlyList<SaleAdvertisementNotificationProduct> Products);
