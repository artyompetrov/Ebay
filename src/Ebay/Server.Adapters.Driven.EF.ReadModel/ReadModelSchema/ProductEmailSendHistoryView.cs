using System.Linq.Expressions;
using Server.Domain;

namespace Server.Adapters.Driven.EF.ReadModel.ReadModelSchema;

internal sealed class ProductEmailSendHistoryView : IViewProjection<ProductEmailSendHistory, ProductEmailSendHistoryView>
{
    public required Guid Id { get; set; }

    public required Guid ProductId { get; set; }

    public required string Seller { get; set; }

    public required string Link { get; set; }

    public required string Marketplace { get; set; }

    public required bool IsAmbiguous { get; set; }

    public required DateTimeOffset AdvertisementDate { get; set; }

    public string? Contact { get; set; }

    public static Expression<Func<ProductEmailSendHistory, ProductEmailSendHistoryView>> ToView => x =>
        new()
        {
            Id = x.Id,
            ProductId = x.ProductId,
            Seller = x.Seller,
            Link = x.Link,
            Marketplace = x.Marketplace,
            IsAmbiguous = x.IsAmbiguous,
            AdvertisementDate = x.AdvertisementDate,
            Contact = x.Contact
        };
}
