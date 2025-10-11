namespace Sever.Adapters.EF.ReadModel.ReadModelSchema;

public sealed class SearchQueryView
{
    public Guid Id { get; set; }

    public string Query { get; set; } = null!;

    public Guid ProductId { get; set; }
    
    public ProductView Product { get; set; } = null!;
}