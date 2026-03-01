using System.Linq.Expressions;
using Server.Domain;
using Server.Domain.Product;

namespace Server.Adapters.Driven.EF.ReadModel.ReadModelSchema;

internal sealed class ProductView : IViewProjection<Product, ProductView>
{
    public required Guid Id { get; set; }

    public required string Name { get; set; }

    public required List<SearchQueryView> SearchQueries { get; set; }
    public required List<SearchQueryView> RuSearchQueries { get; set; }

    public required DateTime LastCheckTime { get; set; }

    public required int Weight { get; set; }

    public required ProductCalculationResult? ProductCalculationResult { get; set; }

    public TubeWorkingPointView TubeWorkingPoint { get; set; } = null!;

    public static Expression<Func<Product, ProductView>> ToView => x =>
        new()
        {
            Id = x.Id,
            Name = x.Name,
            SearchQueries = x.SearchQueries.AsQueryable().Select(SearchQueryView.ToView).ToList(),
            RuSearchQueries = x.RuSearchQueries.AsQueryable().Select(SearchQueryView.ToView).ToList(),
            LastCheckTime = x.LastCheckTime,
            ProductCalculationResult = x.ProductCalculationResult,
            Weight = x.Weight,
        };
}