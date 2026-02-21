using System.Linq.Expressions;
using Server.Domain;

namespace Server.Adapters.Driven.EF.ReadModel.ReadModelSchema;

internal sealed class SearchQueryView : IViewProjection<SearchQuery, SearchQueryView>
{
    public required Guid Id { get; set; }

    public required string Query { get; set; } = null!;


    public static Expression<Func<SearchQuery, SearchQueryView>> ToView => x =>
        new()
        {
            Id = x.Id,
            Query = x.Query
        };
}