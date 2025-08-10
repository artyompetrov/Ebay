using ScottPlot;
using ScottPlot.PlotStyles;

namespace Server.Application.Services.Measurement.MeasurementTypes.Base;

public abstract class MeasurementTypeBase
{
    protected MeasurementTypeBase(int pmax, Dictionary<int, MeasurementPoint[]> measurementPoints,Func<MeasurementPoint, double> variableSelector, Func<MeasurementPoint, double> steppingVariableSelector)
    {

        var minX = 0.0;
        var maxX = 0.0;
        var maxY = 0.0;

        var curves = new List<CurveSet>();

        foreach (var (_, values) in measurementPoints)
        {
            var maxI = values.Select(x => x.Ia).Union(values.Select(x => x.Is)).Max();

            var valuesWithoutNonCompliant = values
                .TakeWhile(x => x.dIa / maxI > IgnoreDi && (!HasSecondCurve || x.dIs / maxI > IgnoreDi))
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

            var lineMaxY = GetMaxI(iValues);
            if (lineMaxY > maxY)
            {
                maxY = lineMaxY;
            }

            var vSteppingValue = values.Select(steppingVariableSelector).Average();

            curves.Add(new CurveSet(vSteppingValue, vValues, i1Values, i2Values));
        }

        MinX = minX;
        MaxX = maxX;
        MaxY = maxY;
        
        Pmax = pmax;
        CurveSets = curves;
    }
    
        
    /// <summary>
    /// Максимальный ток, для точек, находящихся под кривой допустимой нагрузки
    /// </summary>
    private double GetMaxI(List<(double V, double I)> values)
    {
        
        var lowerPmax = values.Where(x => PowerLimit(x.V) > x.I).Select(x => x.I).Append(0.0)
            .Max();
        var abovePmaxValues = values.Where(x => PowerLimit(x.V) < x.I).Select(x => x.I).ToList();

        var lineMaxY = abovePmaxValues.Count == 0 ? lowerPmax : Math.Max(lowerPmax, abovePmaxValues.Min());
        return lineMaxY;
    }
    
    // Максимальное dI - чтобы отсечь некорректные изменения из-за compliance, в долях от максимального тока
    private const double IgnoreDi = -0.1;

    public IReadOnlyCollection<CurveSet> CurveSets { get; }
    
    public abstract string Curve1Name { get; }
    
    /// <summary>
    /// Если Null, то только измеряется только один ток
    /// </summary>
    public abstract string? Curve2Name { get; }
    
    public bool HasSecondCurve => Curve2Name != null;
    
    public abstract string XLabel { get; }
    
    public string YLabel => "I (mA)";

    public abstract string CurveTitle { get; }
    
    public int Pmax { get; }
    
    public abstract bool PlotPmax { get; }

    public double PowerLimit(double v) => Pmax / v;

    public  double MinX { get; }
    public  double MaxX { get; }
    public  double MaxY { get; }

    public abstract string SteppingVariableName { get; }

}