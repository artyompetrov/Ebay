namespace Ebay.Server.Data.Models;

public sealed class Product
{
    public Product(string name, string searchQuery)
    {
        if (string.IsNullOrWhiteSpace(searchQuery))
            throw new ArgumentException(message: "Value cannot be null or whitespace.", paramName: nameof(searchQuery));
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException(message: "Value cannot be null or whitespace.", paramName: nameof(name));
        Name = name;
        SearchQuery = searchQuery;
    }
    
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; }
    public string SearchQuery { get; set; }
}