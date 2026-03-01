using System.Linq.Expressions;
using Server.Domain;

namespace Server.Adapters.Driven.EF.ReadModel.ReadModelSchema;

internal sealed class ProductPassportView : IViewProjection<ProductPassport, ProductPassportView>
{
    public required Guid ProductId { get; set; }
    public ProductView Product { get; set; } = null!;

    public required Guid Id { get; set; }

    public required string FileName { get; set; }

    public static Expression<Func<ProductPassport, ProductPassportView>> ToView => x =>
        new()
        {
            ProductId = x.ProductId,
            Id = x.Id,
            FileName = x.FileName
        };
}