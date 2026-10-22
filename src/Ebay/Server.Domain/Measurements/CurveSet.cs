namespace Server.Domain.Measurements;

public class CurveSet
{
    public double VSteppingValue { get; }
    public IReadOnlyCollection<double> V { get; }
    public IReadOnlyCollection<double> I1 { get; }
    public IReadOnlyCollection<double>? I2 { get; }

    public CurveSet(double vSteppingValue, IReadOnlyCollection<double> v, IReadOnlyCollection<double> i1, IReadOnlyCollection<double>? i2)
    {
        // The only caller (MeasurementTypeBase) builds V, I1 and I2 from the same measurement points,
        // so the series always have equal lengths.
        VSteppingValue = vSteppingValue;
        V = v;
        I1 = i1;
        I2 = i2;
    }
};