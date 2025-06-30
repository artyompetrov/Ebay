using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Application.Data.Models;

public class ProductMeasurement
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    [MaxLength(100)]
    public required string Id { get; set; } = null!;

    public required Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public required MeasurementState MeasurementState { get; set; }

    public required byte[] Measurements { get; set; } = null!;

    [MaxLength(128)]
    public required string HashGridCurves { get; set; } = null!;

    [MaxLength(128)]
    public required string HashAnodeCurves { get; set; } = null!;

    [MaxLength(128)]
    public required string HashQuickTest { get; set; } = null!;

    /// <summary>
    /// Дата производства или код
    /// </summary>

    [MaxLength(128)]
    public required string ManufactureCode { get; set; } = null!;

    public required ProductState ProductState { get; set; }
}