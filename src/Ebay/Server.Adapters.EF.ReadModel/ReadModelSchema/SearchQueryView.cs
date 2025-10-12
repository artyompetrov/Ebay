using System.Linq.Expressions;
using Client.Pages;
using Server.Domain;

namespace Sever.Adapters.EF.ReadModel.ReadModelSchema;

internal sealed class SearchQueryView : IViewProjection<SearchQuery, SearchQueryView>
{
    public required Guid Id { get; set; }

    public required string Query { get; set; } = null!;

    public required Guid ProductId { get; set; }
    
    public ProductView Product { get; set; } = null!;
    
    public static Expression<Func<SearchQuery, SearchQueryView>> ToView => x =>
        new ()
        {
            Id = x.Id,
            Query = x.Query,
            ProductId = x.ProductId,
        };
}