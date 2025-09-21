using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Application.Data.Models.Measurements;

public sealed class TubeWorkingPoint
{
    [Key]
    public Guid ProductId { get; set; }

    public Product Product { get; set; } = null!;

    [Column(TypeName = "double precision")]
    public double AnodeVoltage { get; set; }

    [Column(TypeName = "double precision")]
    public double GridVoltage { get; set; }

    [Column(TypeName = "double precision")]
    public double AnodeVoltageHalfWidth { get; set; }

    [Column(TypeName = "double precision")]
    public double GridVoltageHalfWidth { get; set; }

    [Column(TypeName = "double precision")]
    public double NominalCurrent { get; set; }
}
