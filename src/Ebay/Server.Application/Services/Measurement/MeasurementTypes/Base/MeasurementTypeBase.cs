namespace Server.Application.Services.Measurement.MeasurementTypes.Base;

public abstract class MeasurementTypeBase
{
    /// <param name="pmaxWatt">Максимальная мощность замера в ваттах</param>
    /// <param name="measurementPoints">Данные замера</param>
    /// <param name="variableSelector">Функция селектор для выбора переменной изменяющейся плавно</param>
    /// <param name="steppingVariableSelector">Функция селектор для выбора переменной, изменяющейся ступенчато </param>
    /// <param name="takeMeasurementPointsWhile">Функция позволяющая не отображать точки, полученные после compliance отсечки
    /// для разных типов измерений немного разная логика вычисления этой отсечки, поэтому передается как параметр</param>
    protected MeasurementTypeBase(
        double pmaxWatt,
        Dictionary<int, MeasurementPoint[]> measurementPoints,
        Func<MeasurementPoint, double> variableSelector,
        Func<MeasurementPoint, double> steppingVariableSelector,
        Func<MeasurementPoint, double, bool> takeMeasurementPointsWhile)
    {
        PmaxWatt = pmaxWatt;

        var minX = 0.0;
        var maxX = 0.0;
        var maxY = 0.0;

        var curves = new List<CurveSet>();
        HasValuesAbovePmax = false;
        foreach (var (_, values) in measurementPoints)
        {
            var maxI = values.Select(x => x.Ia).Union(values.Select(x => x.Is)).Max();

            var valuesWithoutNonCompliant = values
                .TakeWhile(x => takeMeasurementPointsWhile(x, maxI))
                .ToList();

            var vValues = valuesWithoutNonCompliant.Select(variableSelector).ToList();
            var i1Values = valuesWithoutNonCompliant.Select(x => x.Ia).ToList();
            var i2Values = HasSecondCurve ? valuesWithoutNonCompliant.Select(x => x.Is).ToList() : null;

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

            var iValues = valuesWithoutNonCompliant.Select(x => (V: x.Va, I: x.Ia)).Union(
                    HasSecondCurve ? valuesWithoutNonCompliant.Select(x => (V: x.Va, I: x.Is)) : [])
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