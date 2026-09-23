using System.Linq.Expressions;
using Server.Domain;

namespace Server.Adapters.Driven.EF.ReadModel.ReadModelSchema;

internal sealed class PurchaseView : IViewProjection<Purchase, PurchaseView>
{
    public required DateTimeOffset Date { get; set; }

    public required long LotId { get; set; }

    public double? Price { get; set; }

    public required int Quantity { get; set; }

    public PurchaseCalculationResult? PurchaseCalculationResult { get; set; }

    public static Expression<Func<Purchase, PurchaseView>> ToView => x =>
        new()
        {
            Date = x.Date,
            LotId = x.LotId,
            Price = x.Price,
            Quantity = x.Quantity,
            PurchaseCalculationResult = x.PurchaseCalculationResult
        };
}
