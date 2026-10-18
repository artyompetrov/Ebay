using Server.Domain.Abstractions;

namespace Server.Domain;

/// <summary>
/// Запись об отправке письма по объявлению о продаже, найденному на стороннем маркетплейсе
/// для отслеживаемого товара. Используется для дедупликации повторных объявлений одного продавца.
/// </summary>
public sealed class ProductEmailSendHistory : AggregateRoot<Guid>
{
    private ProductEmailSendHistory(
        Guid id,
        Guid productId,
        string sellerKey,
        string sellerName,
        string link,
        string marketplace,
        bool isAmbiguous,
        DateTimeOffset advertisementDate,
        string? contact)
        : base(id)
    {
        ProductId = productId;
        SellerKey = sellerKey;
        SellerName = sellerName;
        Link = link;
        Marketplace = marketplace;
        IsAmbiguous = isAmbiguous;
        AdvertisementDate = advertisementDate;
        Contact = contact;
    }

    public static ProductEmailSendHistory Create(
        Guid productId,
        string sellerKey,
        string sellerName,
        string link,
        string marketplace,
        bool isAmbiguous,
        DateTimeOffset advertisementDate,
        string? contact) =>
        new(
            id: Guid.NewGuid(),
            productId: productId,
            sellerKey: sellerKey,
            sellerName: sellerName,
            link: link,
            marketplace: marketplace,
            isAmbiguous: isAmbiguous,
            advertisementDate: advertisementDate,
            contact: string.IsNullOrWhiteSpace(contact) ? null : contact);

    public Guid ProductId { get; }

    /// <summary>
    /// Стабильный ключ продавца в рамках маркетплейса: синтетический идентификатор, если площадка его даёт,
    /// иначе нормализованное видимое имя. По нему (вместе с товаром и маркетплейсом) идёт дедупликация.
    /// </summary>
    public string SellerKey { get; }

    /// <summary>
    /// Отображаемое имя продавца из последнего учтённого объявления.
    /// </summary>
    public string SellerName { get; private set; }

    public string Link { get; private set; }

    public string Marketplace { get; }

    public bool IsAmbiguous { get; private set; }

    /// <summary>
    /// Дата публикации самого свежего учтённого объявления (не путать с унаследованным техническим
    /// <see cref="Entity{TId}.CreatedAt"/>). Никогда не уменьшается.
    /// </summary>
    public DateTimeOffset AdvertisementDate { get; private set; }

    public string? Contact { get; private set; }

    /// <summary>
    /// Учитывает повторное появление товара у этого продавца. Данные объявления (ссылка, дата, неоднозначность,
    /// имя продавца) принимаются, только если оно не старее уже учтённого; непустой контакт принимается всегда.
    /// </summary>
    public void UpdateForNewAdvertisement(
        string link,
        DateTimeOffset advertisementDate,
        bool isAmbiguous,
        string sellerName,
        string? contact)
    {
        if (advertisementDate >= AdvertisementDate)
        {
            Link = link;
            AdvertisementDate = advertisementDate;
            IsAmbiguous = isAmbiguous;
            SellerName = sellerName;
        }

        if (!string.IsNullOrWhiteSpace(contact))
        {
            Contact = contact;
        }
    }
}
