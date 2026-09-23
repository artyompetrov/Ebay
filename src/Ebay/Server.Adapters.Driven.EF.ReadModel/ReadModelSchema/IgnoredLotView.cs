using System.Linq.Expressions;
using Server.Domain;

namespace Server.Adapters.Driven.EF.ReadModel.ReadModelSchema;

internal sealed class IgnoredLotView : IViewProjection<IgnoredLot, IgnoredLotView>
{
    public required Guid ProductId { get; set; }

    public required long LotId { get; set; }

    public static Expression<Func<IgnoredLot, IgnoredLotView>> ToView => x =>
        new()
        {
            ProductId = x.ProductId,
            LotId = x.LotId
        };
}
