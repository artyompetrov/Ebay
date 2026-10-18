namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Объявление о продаже, полученное со стороннего маркетплейса.
/// </summary>
/// <param name="Title">Заголовок объявления.</param>
/// <param name="SellerKey">Стабильный ключ продавца в рамках маркетплейса (синтетический id или нормализованное имя).</param>
/// <param name="SellerName">Отображаемое имя продавца.</param>
/// <param name="Date">Дата публикации объявления.</param>
/// <param name="Link">Ссылка на объявление.</param>
/// <param name="Items">Строки объявления, которые сопоставляются с товарами.</param>
public record SaleAdvertisement(
    string Title,
    string SellerKey,
    string SellerName,
    DateTimeOffset Date,
    Uri Link,
    string[] Items);
