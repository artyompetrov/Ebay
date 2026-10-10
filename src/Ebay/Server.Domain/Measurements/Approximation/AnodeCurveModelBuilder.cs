using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Domain.Measurements.Approximation;

/// <summary>
/// Строит аппроксимационные модели анодных кривых для сравнения замеров.
/// </summary>
public static class AnodeCurveModelBuilder
{
    private const double MinNormalizationBase = 1e-9;
    private const double PercentScale = 100.0;
    private const int InputDimensions = 2;
    private const int OutputDimensions = 1;
    private const double RbfBaseRadius = 1.0;
    private const int RbfLayers = 6;
    private const double RbfRegularization = 1e-5;

    /// <summary>
    /// Строит модель по кривым анодного тока и рабочей точке.
    /// </summary>
    /// <param name="anodeCurves">Анодные кривые замера.</param>
    /// <param name="currentSelector">Выбор тока (секции) из набора кривых.</param>
    /// <param name="workingPoint">Рабочая точка, относительно которой нормализуются кривые.</param>
    public static AnodeCurveModel Build(
        AnodeCurvesBase anodeCurves,
        Func<CurveSet, IReadOnlyCollection<double>> currentSelector,
        ApproximationWorkingPoint workingPoint)
    {
        var points = new List<MeasurementPoint>();
        foreach (var result in anodeCurves.CurveSets)
        {
            foreach (var (va, ia) in result.V.Zip(second: currentSelector(result), (va, ia) => (va, ia)))
            {
                points.Add(new(
                    Va: va,
                    Vg: result.VSteppingValue,
                    Ia: ia));
            }
        }

        return RbfModel(points, workingPoint);
    }

    private record struct MeasurementPoint(double Va, double Vg, double Ia);

    /// <summary>
    /// Функция создает модель при помощи RBF интерполяции.
    /// </summary>
    private static AnodeCurveModel RbfModel(List<MeasurementPoint> points, ApproximationWorkingPoint wp)
    {
        var baseAnodeVoltage = Math.Max(val1: MinNormalizationBase, val2: wp.AnodeVoltageHalfWidth);
        var baseGridVoltage = Math.Max(val1: MinNormalizationBase, val2: wp.GridVoltageHalfWidth);
        var baseAnodeCurrent = Math.Max(val1: MinNormalizationBase, val2: wp.NominalCurrent);

        var xy = new double[points.Count, InputDimensions + OutputDimensions];
        for (var i = 0; i < points.Count; i++)
        {
            // нормализация относительно рабочей точки и полуосей эллипса
            xy[i, 0] = (points[i].Va - wp.AnodeVoltage) / baseAnodeVoltage;
            xy[i, 1] = (points[i].Vg - wp.GridVoltage) / baseGridVoltage;
            xy[i, 2] = points[i].Ia / baseAnodeCurrent * PercentScale; // нормализуем и приводим к процентам
        }

        alglib.rbfcreate(nx: InputDimensions, ny: OutputDimensions, s: out var model);
        alglib.rbfsetpoints(s: model, xy: xy);
        alglib.rbfsetalgomultilayer(s: model, rbase: RbfBaseRadius, nlayers: RbfLayers, lambdav: RbfRegularization);
        alglib.rbfbuildmodel(s: model, rep: out _);
        return new AnodeCurveModel(
            rbf: model,
            baseAnodeCurrent: baseAnodeCurrent);
    }
}
