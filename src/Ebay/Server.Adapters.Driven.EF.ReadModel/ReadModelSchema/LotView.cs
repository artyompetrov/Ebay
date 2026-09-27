using System.Linq.Expressions;
using Server.Domain;

namespace Server.Adapters.Driven.EF.ReadModel.ReadModelSchema;

internal sealed class LotView : IViewProjection<Lot, LotView>
{
    public required long Id { get; set; }

    public required Guid ProductId { get; set; }

    public required string Name { get; set; }

    public required int Pcs { get; set; }

    public int? LotSize { get; set; }

    public required string CurrencyId { get; set; }

    public required string ShippingCountry { get; set; }

    public required double Price { get; set; }

    public required double Shipping { get; set; }

    public required double ShippingAdditional { get; set; }

    public required string Description { get; set; }

    public string? ShortDescription { get; set; }

    public required string Condition { get; set; }

    public string? ConditionDescription { get; set; }

    public required string Seller { get; set; }

    public required string LocatedIn { get; set; }

    public required DateTimeOffset TitleChangeDate { get; set; }

    public required DateTimeOffset UpdateDate { get; set; }

    public required Dictionary<string, string> Categories { get; set; }

    public required List<PurchaseView> Purchases { get; set; }

    public LotCalculationResult? LotCalculationResult { get; set; }

    public static Expression<Func<Lot, LotView>> ToView => x =>
        new()
        {
            Id = x.Id,
            ProductId = x.ProductId,
            Name = x.Name,
            Pcs = x.Pcs,
            LotSize = x.LotSize,
            CurrencyId = x.CurrencyId,
            ShippingCountry = x.ShippingCountry,
            Price = x.Price,
            Shipping = x.Shipping,
            ShippingAdditional = x.ShippingAdditional,
            Description = x.Description,
            ShortDescription = x.ShortDescription,
            Condition = x.Condition,
            ConditionDescription = x.ConditionDescription,
            Seller = x.Seller,
            LocatedIn = x.LocatedIn,
            TitleChangeDate = x.TitleChangeDate,
            UpdateDate = x.UpdateDate,
            Categories = new Dictionary<string, string>(x.Categories),
            Purchases = new List<PurchaseView>(),
            LotCalculationResult = x.LotCalculationResult,
        };
}
