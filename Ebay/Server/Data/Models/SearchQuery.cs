using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ebay.Server.Data.Models;

public sealed class SearchQuery
{

    public Guid Id { get; set; }

    public string Query { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
}