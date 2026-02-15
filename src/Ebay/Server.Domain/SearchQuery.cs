namespace Server.Domain;

/// <summary>
/// класс доменной модели.
/// </summary>
public sealed class SearchQuery : Entity<Guid>
{
    /// <summary>
    /// операция.
    /// </summary>
    public SearchQuery(Guid id, string query, Guid productId)
        : base(id)
    {
        Query = query;
        ProductId = productId;
    }

    /// <summary>
    /// свойство.
    /// </summary>
    public string Query { get; private set; }

    /// <summary>
    /// операция.
    /// </summary>
    public void SetQuery(string query) => Query = query;

    /// <summary>
    /// свойство.
    /// </summary>
    public Guid ProductId { get; }
}
