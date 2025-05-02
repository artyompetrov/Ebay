using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Data.Models;

internal class ProductMeasurement
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    [MaxLength(100)]
    public required string Id { get; set; } = null!;
    
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    public MeasurementState State { get; set; }
    
    public byte[] Measurements { get; set; } = null!;
}