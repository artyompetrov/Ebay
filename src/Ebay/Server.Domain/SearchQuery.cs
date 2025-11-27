namespace Server.Domain;

public sealed class SearchQuery(Guid id, string query, Guid productId) : Entity<Guid>(id)
{
    public string Query { get; private set; } = query;

    public void SetQuery(string query) => Query = query;

    public Guid ProductId { get; } = productId;
}