namespace Server.Domain.SaleAdvertisements;

/// <summary>
/// Строка объявления и товары, с которыми она совпала.
/// </summary>
/// <param name="Text">Текст строки объявления.</param>
/// <param name="Products">Совпавшие товары в порядке сопоставления.</param>
public sealed record SaleAdvertisementLineMatch(string Text, IReadOnlyList<SaleAdvertisementProductMatch> Products);
