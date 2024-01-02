namespace Ebay.Server.Data.Models;

public sealed class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string SearchQuery { get; set; } = null!;
}