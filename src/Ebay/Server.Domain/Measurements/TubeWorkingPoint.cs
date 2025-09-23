using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Domain.Measurements;

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


    /// <summary>
    /// Проверяет корректность рабочей точки:
    /// - Полуширины напряжений должны быть > 1.0
    /// - Номинальный ток должен быть > 1.0
    ///
    /// </summary>
    public bool IsValid =>
        AnodeVoltageHalfWidth > 1.0 &&
        GridVoltageHalfWidth > 0.5 &&
        NominalCurrent > 1.0 &&
        AnodeVoltage > 1.0 &&
        GridVoltage < -1.0;
}