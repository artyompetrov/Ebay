namespace Sever.Adapters.EF.ReadModel.ReadModelSchema;

public class ProductPassportView
{
    public required Guid ProductId { get; set; }
    public ProductView Product { get; set; } = null!;
    
    public required Guid Id { get; set; }
    
    public required string FileName { get; set; }
}