using System.ComponentModel.DataAnnotations;

namespace Server.Domain.Measurements;

public class MatchedPairDifference : AggregateRoot<MatchedPairDifferenceId>
{
    private MatchedPairDifference(
        MatchedPairDifferenceId id,
        ComparisonMode comparisonMode,
        double mseSection1,
        double? mseSection2,
        double rmseSection1,
        double? rmseSection2,
        double maxAbsSection1,
        double? maxAbsSection2) : base(id)
    {
        ComparisonMode = comparisonMode;
        Measurement1Id = id.Measurement1Id;
        Measurement2Id = id.Measurement2Id;
        MseSection1 = mseSection1;
        MseSection2 = mseSection2;
        RmseSection1 = rmseSection1;
        RmseSection2 = rmseSection2;
        MaxAbsSection1 = maxAbsSection1;
        MaxAbsSection2 = maxAbsSection2;
    }

    public static MatchedPairDifference Create(
        MatchedPairDifferenceId id,
        ComparisonMode comparisonMode,
        double mseSection1,
        double? mseSection2,
        double rmseSection1,
        double? rmseSection2,
        double maxAbsSection1,
        double? maxAbsSection2) =>
        new(
            id: id,
            comparisonMode: comparisonMode,
            mseSection1: mseSection1,
            mseSection2: mseSection2,
            rmseSection1: rmseSection1,
            rmseSection2: rmseSection2,
            maxAbsSection1: maxAbsSection1,
            maxAbsSection2: maxAbsSection2);

    public ComparisonMode ComparisonMode { get; }

    [MaxLength(100)]
    public string Measurement1Id { get; }

    [MaxLength(100)]
    public string Measurement2Id { get; }

    /// <summary>
    /// Среднеквадратичная ошибка (Mean Squared Error) между аппроксимированными 
    /// анодно-сеточными характеристиками двух ламп. 
    /// Показывает усреднённый квадрат относительного отклонения анодных токов 
    /// при одинаковых напряжениях.
    /// Измеряется в %^2.
    /// </summary>
    public double MseSection1 { get; }
    public double? MseSection2 { get; }

    /// <summary>
    /// Среднеквадратичное отклонение (Root Mean Squared Error) между характеристиками.  
    /// Показывает среднее относительное отличие токов двух ламп в рабочей области.  
    /// В отличие от MSE имеет ту же размерность (проценты), поэтому удобен для интерпретации:  
    /// чем меньше значение, тем ближе лампы ведут себя одинаково.
    /// Измеряется в %.
    /// </summary>
    public double RmseSection1 { get; }
    public double? RmseSection2 { get; }

    /// <summary>
    /// Максимальное абсолютное относительное отклонение анодного тока между лампами 
    /// в точках сравнения.  
    /// Характеризует «наихудший случай» расхождения: насколько сильно может отличаться 
    /// ток одной лампы от другой при одинаковых напряжениях.
    /// Измеряется в %.
    /// </summary>
    public double MaxAbsSection1 { get; }
    public double? MaxAbsSection2 { get; }
}