namespace Server.Application.Services.Measurement;

public class CurveSet
{
    public double VSteppingValue { get; }
    public IReadOnlyCollection<double> V { get; }
    public IReadOnlyCollection<double> I1 { get; }
    public IReadOnlyCollection<double>? I2 { get; }

    public CurveSet(double vSteppingValue, IReadOnlyCollection<double> v, IReadOnlyCollection<double> i1, IReadOnlyCollection<double>? i2)
    {
        VSteppingValue = vSteppingValue;
        if (v.Count != i1.Count && (i2 != null && v.Count != i2.Count)) throw new ArgumentException("length expected to be equal");
        
        V = v;
        I1 = i1;
        I2 = i2;
    }
};