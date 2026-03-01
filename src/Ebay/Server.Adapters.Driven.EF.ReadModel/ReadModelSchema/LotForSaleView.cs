using System.Linq.Expressions;
using Server.Domain.LotForSale;
using Server.Domain.Measurements;

namespace Server.Adapters.Driven.EF.ReadModel.ReadModelSchema;

internal sealed class LotForSaleView : IViewProjection<LotForSale, LotForSaleView>
{
    public required string Id { get; set; }

    public required string Name { get; set; }

    public required Guid ProductId { get; set; }

    public required ProductState ProductState { get; set; }

    public required MeasurementState MeasurementState { get; set; }

    public static Expression<Func<LotForSale, LotForSaleView>> ToView => x =>
        new()
        {
            Id = x.Id,
            Name = x.Name,
            ProductId = x.ProductId,
            ProductState = x.ProductState,
            MeasurementState = x.MeasurementState
        };
}