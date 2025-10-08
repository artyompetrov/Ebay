using Server.Domain.Measurements;

namespace Sever.Adapters.EF.ReadModel.Dtos;

public class ProductMeasurementDto
{
    public required string Id { get; set; }
    
    public required MeasurementState MeasurementState { get; set; }
    public required ProductState ProductState { get; set; }
    
    public required Guid ProductId { get; set; }
    
    public required byte[] Measurements  { get; set; }
}