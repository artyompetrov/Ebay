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
        string seller,
        string link,
        string marketplace,
        bool isAmbiguous,
        DateTimeOffset advertisementDate,
        string? contact)
        : base(id)
    {
        ProductId = productId;
        Seller = seller;
        Link = link;
        Marketplace = marketplace;
        IsAmbiguous = isAmbiguous;
        AdvertisementDate = advertisementDate;
        Contact = contact;
    }

    public static ProductEmailSendHistory Create(
        Guid productId,
        string seller,
        string link,
        string marketplace,
        bool isAmbiguous,
        DateTimeOffset advertisementDate,
        string? contact) =>
        new(
            id: Guid.NewGuid(),
            productId: productId,
            seller: seller,
            link: link,
            marketplace: marketplace,
            isAmbiguous: isAmbiguous,
            advertisementDate: advertisementDate,
            contact: contact);

    public Guid ProductId { get; }

    public string Seller { get; }

    public string Link { get; private set; }

    public string Marketplace { get; }

    public bool IsAmbiguous { get; private set; }

    /// <summary>
    /// Дата публикации объявления (не путать с унаследованным техническим <see cref="Entity{TId}.CreatedAt"/>).
    /// </summary>
    public DateTimeOffset AdvertisementDate { get; private set; }

    //todo нужно сделать логику чтобы не затиралась null значениями
    public string? Contact { get; private set; }

    public void UpdateForNewAdvertisement(string link, DateTimeOffset advertisementDate, bool isAmbiguous, string? contact)
    {
        Link = link;
        AdvertisementDate = advertisementDate;
        IsAmbiguous = isAmbiguous;
        if (!string.IsNullOrWhiteSpace(contact))
        {
            Contact = contact;
        }
    }
}
