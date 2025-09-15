namespace Server.Application.Services.Measurement.MeasurementTypes.Base;

public abstract class MeasurementTypeBase
{
    protected readonly Dictionary<int, MeasurementPoint[]> MeasurementPoints;

    /// <param name="pmaxWatt">Максимальная мощность замера в ваттах</param>
    /// <param name="measurementPoints">Данные замера</param>
    /// <param name="variableSelector">Функция селектор для выбора переменной изменяющейся плавно</param>
    /// <param name="steppingVariableSelector">Функция селектор для выбора переменной, изменяющейся ступенчато </param>
    /// <param name="takeMeasurementPointsWhile">Функция позволяющая не отображать точки, полученные после compliance отсечки
    /// для разных типов измерений немного разная логика вычисления этой отсечки, поэтому передается как параметр</param>
    /// <param name="filterCurves"></param>
    protected MeasurementTypeBase(
        double pmaxWatt,
        Dictionary<int, MeasurementPoint[]> measurementPoints,
        Func<MeasurementPointWithDelta, double> variableSelector,
        Func<MeasurementPointWithDelta, double> steppingVariableSelector,
        Func<MeasurementPointWithDelta, double, bool> takeMeasurementPointsWhile,
        Func<ICollection<MeasurementPointWithDelta[]>, ICollection<MeasurementPointWithDelta[]>> filterCurves)
    {
        PmaxWatt = pmaxWatt;

        MeasurementPoints = measurementPoints;

        var measurementPointsWithDelta = measurementPoints.ToDictionary(
            x => x.Key,
            y => ToMeasurementPointWithDelta(y.Value));

        var minX = 0.0;
        var maxX = 0.0;
        var maxY = 0.0;

        var curves = new List<CurveSet>();
        HasValuesAbovePmax = false;

        var rows = filterCurves(measurementPointsWithDelta.Values).Select(values =>
            {
                var maxI = values.Select(x => x.Ia).Union(values.Select(x => x.Is)).Max();

                var valuesWithoutNonCompliant = values
                    .TakeWhile(x => takeMeasurementPointsWhile(x, maxI))
                    .ToList();

                return valuesWithoutNonCompliant;
            })
            //utracer всегда делает первый замер, поэтому 1 точка на графике тоже не должна сохраняться как линия
            .Where(x => x.Count(y => y.Ia > 0.1) > 1)
            .ToList();

        foreach (var values in rows)
        {
            var vValues = values.Select(variableSelector).ToList();
            var i1Values = values.Select(x => x.Ia).ToList();
            var i2Values = HasSecondCurve ? values.Select(x => x.Is).ToList() : null;

            var lineMinX = vValues.Min();
            if (lineMinX < minX)
            {
                minX = lineMinX;
            }

            var lineMaxX = vValues.Max();
            if (lineMaxX > maxX)
            {
                maxX = lineMaxX;
            }

            var iValues = values.Select(x => (V: x.Va, I: x.Ia)).Union(
                    HasSecondCurve ? values.Select(x => (V: x.Va, I: x.Is)) : [])
                .ToList();

            var (lineMaxY, hasValuesAbovePmax) = GetMaxI(iValues);
            if (lineMaxY > maxY)
            {
                maxY = lineMaxY;
            }

            if (hasValuesAbovePmax)
            {
                HasValuesAbovePmax = true;
            }

            var vSteppingValue = values.Select(steppingVariableSelector).Average();

            curves.Add(new CurveSet(vSteppingValue, vValues, i1Values, i2Values));
        }

        MinX = minX;
        MaxX = maxX;
        MaxY = maxY;
        CurveSets = curves;
    }

    private MeasurementPointWithDelta[] ToMeasurementPointWithDelta(MeasurementPoint[] measurementPoints)
    {
        var previousIa = 0.0;
        var previousIs = 0.0;
        var previousVg = 0.0;
        var previousVa = 0.0;
        var previousVs = 0.0;
        var previousVf = 0.0;

        var result = new MeasurementPointWithDelta[measurementPoints.Length];

        for (var idx = 0; idx < measurementPoints.Length; idx++)
        {
            var currentValue = measurementPoints[idx];

            result[idx] = new MeasurementPointWithDelta(
                measurementPoints[idx],
                dIa: currentValue.Ia - previousIa,
                dIs: currentValue.Is - previousIs,
                dVg: currentValue.Vg - previousVg,
                dVa: currentValue.Va - previousVa,
                dVs: currentValue.Vs - previousVs,
                dVf: currentValue.Vf - previousVf
            );

            previousIa = currentValue.Ia;
            previousIs = currentValue.Is;
            previousVg = currentValue.Vg;
            previousVa = currentValue.Va;
            previousVs = currentValue.Vs;
            previousVf = currentValue.Vf;
        }

        return result;
    }

    /// <summary>
    /// Транспонирует матрицу анодной характеристики, чтобы получить сеточную
    /// </summary>
    protected Dictionary<int, MeasurementPoint[]> GetGridCurvesFromAnodeCurves(Dictionary<int, MeasurementPoint[]> anodeCurves)
    {
        // Определяем максимальную длину массива (чтобы знать количество "столбцов")
        var maxCols = anodeCurves.Values.Max(arr => arr.Length);

        // Создаем новую матрицу (транспонированную)
        var transposed = new Dictionary<int, MeasurementPoint[]>();

        for (var col = 0; col < maxCols; col++)
        {
            var newRow = new List<MeasurementPoint>();

            foreach (var row in anodeCurves.OrderByDescending(kv => kv.Key)) // порядок по ключам
            {
                if (col < row.Value.Length) // проверяем, что элемент есть
                    newRow.Add(row.Value[col]);
            }

            transposed[col + 1] = newRow.ToArray(); // "+1", чтобы ключи шли с 1
        }

        var result = transposed
            .ToDictionary(x => x.Key, x => x.Value);

        return result;
    }


    /// <summary>
    /// Максимальный ток, для точек, находящихся под кривой допустимой нагрузки
    /// </summary>
    private GetMaxIAnalysis GetMaxI(List<(double V, double I)> values)
    {
        var belowPmaxValuesMaxI = values.Where(x => MaxI(x.V) > x.I).Select(x => x.I)
            .Append(0.0)
            .Max();

        var abovePmaxValues = values.Where(x => MaxI(x.V) < x.I).Select(x => x.I)
            .ToList();

        var lineMaxY = abovePmaxValues.Count == 0
            ? belowPmaxValuesMaxI
            : Math.Max(belowPmaxValuesMaxI, abovePmaxValues.Min());

        return new GetMaxIAnalysis(
            MaxI: lineMaxY,
            HasValuesAbovePmax: abovePmaxValues.Count > 0);
    }

    private record GetMaxIAnalysis(double MaxI, bool HasValuesAbovePmax);

    // Максимальное dI - чтобы отсечь некорректные изменения из-за compliance, в долях от максимального тока
    protected const double IgnoreDi = -0.1;

    public IReadOnlyCollection<CurveSet> CurveSets { get; }

    public abstract string Curve1Name { get; }

    /// <summary>
    /// Если Null, то только измеряется только один ток
    /// </summary>
    public abstract string? Curve2Name { get; }

    public bool HasSecondCurve => Curve2Name != null;

    public abstract string XLabel { get; }

    public string YLabel => "I (mA)";

    public bool HasValuesAbovePmax { get; }

    public abstract string CurveTitle { get; }

    public double PmaxWatt { get; }

    public abstract bool PlotPmax { get; }

    /// <summary>
    /// Функция максимального тока в связи с лимитом по мощности - результат ток в милиамперрах
    /// </summary>
    public double MaxI(double v) => PmaxWatt * 1000.0 / v;

    public double MinX { get; }
    public double MaxX { get; }
    public double MaxY { get; }

    public abstract string SteppingVariableName { get; }

}