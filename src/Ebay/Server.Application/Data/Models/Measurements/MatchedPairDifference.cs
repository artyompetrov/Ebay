using System.ComponentModel.DataAnnotations;

namespace Server.Application.Data.Models.Measurements;

public class MatchedPairDifference
{
    public ComparisonMode ComparisonMode { get; set; }
    
    [MaxLength(100)]
    public required string MeasurementId1 { get; set; }

    [MaxLength(100)]
    public required string MeasurementId2 { get; set; }

    /// <summary>
    /// Среднеквадратичная ошибка (Mean Squared Error) между аппроксимированными 
    /// анодно-сеточными характеристиками двух ламп. 
    /// Показывает усреднённый квадрат отклонения анодных токов при одинаковых напряжениях.
    /// Измеряется в (мА)^2.
    /// </summary>
    public double MseSection1 { get; set; }
    public double? MseSection2 { get; set; }

    /// <summary>
    /// Среднеквадратичное отклонение (Root Mean Squared Error) между характеристиками.
    /// Это «среднее отличие токов» двух ламп в рабочей области. 
    /// В отличие от MSE имеет ту же размерность, что и ток (мА), поэтому удобен для 
    /// интерпретации: чем меньше значение, тем ближе лампы ведут себя одинаково.
    /// </summary>
    public double RmseSection1 { get; set; }
    public double? RmseSection2 { get; set; }

    /// <summary>
    /// Максимальное абсолютное отклонение анодного тока между лампами в точках сравнения.
    /// Характеризует «наихудший случай» расхождения: насколько сильно может отличаться 
    /// ток одной лампы от другой при одинаковых напряжениях. Измеряется в мА.
    /// </summary>
    public double MaxAbsSection1 { get; set; }
    public double? MaxAbsSection2 { get; set; }

    public ProductMeasurement Measurement1 { get; set; } = null!;

    public ProductMeasurement Measurement2 { get; set; } = null!;
}
