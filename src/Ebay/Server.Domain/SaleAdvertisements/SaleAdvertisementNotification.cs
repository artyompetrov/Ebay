namespace Server.Domain.SaleAdvertisements;

/// <summary>
/// Уведомление о новом интересном объявлении: строки объявления, вызвавшие его, и все совпавшие с ними товары.
/// </summary>
public sealed class SaleAdvertisementNotification
{
    private SaleAdvertisementNotification(
        string title,
        string sellerName,
        Uri link,
        string? contact,
        IReadOnlyList<SaleAdvertisementNotificationLine> lines)
    {
        Title = title;
        SellerName = sellerName;
        Link = link;
        Contact = contact;
        Lines = lines;
    }

    public string Title { get; }

    /// <summary>
    /// Отображаемое имя продавца.
    /// </summary>
    public string SellerName { get; }

    public Uri Link { get; }

    /// <summary>
    /// Контакт продавца или <see langword="null"/>, если его не удалось получить.
    /// </summary>
    public string? Contact { get; }

    /// <summary>
    /// Строки объявления в порядке объявления, без повторов; не пусто.
    /// </summary>
    public IReadOnlyList<SaleAdvertisementNotificationLine> Lines { get; }

    /// <summary>
    /// Составляет уведомление по совпадениям строк объявления с товарами.
    /// Товар вызывает уведомление, если он интересен и хотя бы одно его совпадение в объявлении впервые учло его
    /// для продавца. В уведомление попадают строки, совпавшие хотя бы с одним таким товаром, вместе со всеми
    /// своими товарами; строка с уже показанным текстом не повторяется.
    /// </summary>
    /// <returns>Уведомление или <see langword="null"/>, если ни один товар не вызывает уведомления.</returns>
    public static SaleAdvertisementNotification? Compose(
        string title,
        string sellerName,
        Uri link,
        string? contact,
        IReadOnlyCollection<SaleAdvertisementLineMatch> lineMatches,
        ExchangeRate? targetRate)
    {
        var triggeringProductIds = lineMatches
            .SelectMany(static x => x.Products)
            .Where(static x => x.IsInteresting && x.IsNewlyRecorded)
            .Select(static x => x.ProductId)
            .ToHashSet();

        SaleAdvertisementNotificationLine[] lines =
        [
            .. lineMatches
                .Where(x => x.Products.Any(product => triggeringProductIds.Contains(product.ProductId)))
                .DistinctBy(static x => x.Text)
                .Select(x => new SaleAdvertisementNotificationLine(
                    Text: x.Text,
                    Products: [.. x.Products.Select(product => ToNotificationProduct(product, triggeringProductIds, targetRate))]))
        ];

        return lines.Length == 0
            ? null
            : new SaleAdvertisementNotification(
                title,
                sellerName,
                link,
                string.IsNullOrWhiteSpace(contact) ? null : contact,
                lines);
    }

    private static SaleAdvertisementNotificationProduct ToNotificationProduct(
        SaleAdvertisementProductMatch product,
        HashSet<Guid> triggeringProductIds,
        ExchangeRate? targetRate) =>
        new(
            Name: product.Name,
            EstimatedPrice: EstimatedPrice.FromUsd(product.RevenueAvgUsd, targetRate),
            QuantityTotal: product.QuantityTotal,
            IsTriggering: triggeringProductIds.Contains(product.ProductId));
}
