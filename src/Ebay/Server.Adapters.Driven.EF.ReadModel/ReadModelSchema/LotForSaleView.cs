using System.Linq.Expressions;
using Server.Domain.LotForSale;

namespace Server.Adapters.Driven.EF.ReadModel.ReadModelSchema;

internal sealed class LotForSaleView : IViewProjection<LotForSale, LotForSaleView>
{
    public required string Id { get; set; }

    public required string Name { get; set; }

    public static Expression<Func<LotForSale, LotForSaleView>> ToView => x =>
        new()
        {
            Id = x.Id,
            Name = x.Name
        };
}
