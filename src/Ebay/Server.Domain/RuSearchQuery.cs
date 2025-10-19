using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Domain;

public sealed class RuSearchQuery : Entity<Guid>
{
    public RuSearchQuery(Guid id, string query, Guid productId) : base(id)
    {
        Query = query;
        ProductId = productId;
    }
    
    public string Query { get; private set; }

    public void SetQuery(string query)
    {
        Query = query;
    }
    
    public Guid ProductId { get; }
}