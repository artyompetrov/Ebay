namespace Server.Domain.Measurements.Approximation;

/// <summary>
/// Интерполяционная модель анодных кривых в нормализованных координатах.
/// </summary>
public sealed class AnodeCurveModel
{
    private const double PercentScale = 100.0;

    private readonly alglib.rbfmodel _rbf;
    private readonly double _baseAnodeCurrent;

    internal AnodeCurveModel(alglib.rbfmodel rbf, double baseAnodeCurrent)
    {
        _rbf = rbf;
        _baseAnodeCurrent = baseAnodeCurrent;
    }

    /// <summary>
    /// Возвращает относительное значение тока в заданной нормализованной точке.
    /// </summary>
    public double ApproximateRelative(double anodeVoltage, double gridVoltage) => alglib.rbfcalc2(s: _rbf, x0: anodeVoltage, x1: gridVoltage);

    /// <summary>
    /// Возвращает оценку тока в заданной нормализованной точке в абсолютных единицах.
    /// </summary>
    public double ApproximateAbsolute(double anodeVoltage, double gridVoltage) => ApproximateRelative(anodeVoltage: anodeVoltage, gridVoltage: gridVoltage) * _baseAnodeCurrent / PercentScale;

    /// <summary>
    /// Возвращает оценку тока в рабочей точке в абсолютных единицах.
    /// </summary>
    public double IatWorkingPoint() => ApproximateAbsolute(anodeVoltage: 0, gridVoltage: 0);
}
