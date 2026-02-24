using Server.Application.Abstractions.Driven.Models;
using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Application.New.Services;

#pragma warning disable CA1822
/// <summary>
/// Строит аппроксимационные модели анодных кривых для сравнения замеров.
/// </summary>
public class MeasurementApproximationService
{
    /// <summary>
    /// Интерполяционная модель анодных кривых в нормализованных координатах.
    /// </summary>
    public class Model
    {
        private readonly alglib.rbfmodel _rbf;
        private readonly double _baseAnodeCurrent;

        /// <summary>
        /// Создает экземпляр интерполяционной модели.
        /// </summary>
        /// <param name="rbf">RBF-модель из библиотеки alglib.</param>
        /// <param name="baseAnodeCurrent">Базовое значение анодного тока для денормализации.</param>
        public Model(alglib.rbfmodel rbf, double baseAnodeCurrent)
        {
            _rbf = rbf;
            _baseAnodeCurrent = baseAnodeCurrent;
        }

        /// <summary>
        /// Возвращает относительное значение тока в заданной нормализованной точке.
        /// </summary>
        public double ApproximateRelative(double anodeVoltage, double gridVoltage) => alglib.rbfcalc2(s: _rbf, x0: anodeVoltage, x1: gridVoltage);

        /// <summary>
        /// Возвращает оценку тока в рабочей точке в абсолютных единицах.
        /// </summary>
        public double IatWorkingPoint() => alglib.rbfcalc2(s: _rbf, x0: 0, x1: 0) * _baseAnodeCurrent / 100.0;
    }

    /// <summary>
    /// Строит модель по кривым анодного тока и рабочей точке.
    /// </summary>
    public Model GetModel(AnodeCurvesBase anodeCurves, Func<CurveSet, IReadOnlyCollection<double>> iExtractor, TubeWorkingPointInfo wp)
    {
        var points = new List<MeasurementPoint>();
        foreach (var result in anodeCurves.CurveSets)
        {
            foreach (var (va, ia) in result.V.Zip(second: iExtractor(result), (va, ia) => (va, ia)))
            {
                points.Add(new(
                    Va: va,
                    Vg: result.VSteppingValue,
                    Ia: ia));
            }

        }

        return RbfModel(points, wp);
    }

    private record struct MeasurementPoint(double Va, double Vg, double Ia);

    /// <summary>
    /// Функция создает модель при помощи RBF интерполяции.
    /// </summary>
    private Model RbfModel(List<MeasurementPoint> points, TubeWorkingPointInfo wp)
    {
        var baseAnodeVoltage = Math.Max(val1: 1e-9, val2: wp.AnodeVoltageHalfWidth);
        var baseGridVoltage = Math.Max(val1: 1e-9, val2: wp.GridVoltageHalfWidth);
        var baseAnodeCurrent = Math.Max(val1: 1e-9, val2: wp.NominalCurrent);

        var xy = new double[points.Count, 3];
        for (var i = 0; i < points.Count; i++)
        {
            // нормализация относительно рабочей точки и полуосей эллипса
            xy[i, 0] = (points[i].Va - wp.AnodeVoltage) / baseAnodeVoltage;
            xy[i, 1] = (points[i].Vg - wp.GridVoltage) / baseGridVoltage;
            xy[i, 2] = points[i].Ia / baseAnodeCurrent * 100.0; // нормализуем и приводим к процентам
        }

        alglib.rbfcreate(nx: 2, ny: 1, s: out var model);
        alglib.rbfsetpoints(s: model, xy: xy);
        alglib.rbfsetalgomultilayer(s: model, rbase: 1.0, nlayers: 6, lambdav: 1e-5);
        alglib.rbfbuildmodel(s: model, rep: out _);
        return new Model(
            rbf: model,
            baseAnodeCurrent: baseAnodeCurrent);
    }
}
#pragma warning restore CA1822
