using System.Linq.Expressions;
using Server.Domain;

namespace Server.Adapters.Driven.EF.ReadModel.ReadModelSchema;

internal sealed class LotView : IViewProjection<Lot, LotView>
{
    public required long Id { get; set; }

    public required Guid ProductId { get; set; }

    public required LotCalculationResult? LotCalculationResult { get; set; }

    public static Expression<Func<Lot, LotView>> ToView => x =>
        new()
        {
            Id = x.Id,
            ProductId = x.ProductId,
            LotCalculationResult = x.LotCalculationResult,
        };
}
