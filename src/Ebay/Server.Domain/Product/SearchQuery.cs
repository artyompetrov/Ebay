using Server.Domain.Abstractions;

namespace Server.Domain.Product;

public sealed class SearchQuery : Entity<Guid>
{
    public SearchQuery(Guid id, string query, Guid productId)
        : base(id)
    {
        Query = query;
        ProductId = productId;
    }

    public string Query { get; private set; }

    public void SetQuery(string query) => Query = query;

    public Guid ProductId { get; }
}