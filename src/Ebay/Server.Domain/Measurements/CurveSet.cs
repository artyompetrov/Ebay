namespace Server.Domain.Measurements;

/// <summary>
/// класс доменной модели.
/// </summary>
public class CurveSet
{
    /// <summary>
    /// свойство.
    /// </summary>
    public double VSteppingValue { get; }
    /// <summary>
    /// свойство.
    /// </summary>
    public IReadOnlyCollection<double> V { get; }
    /// <summary>
    /// свойство.
    /// </summary>
    public IReadOnlyCollection<double> I1 { get; }
    /// <summary>
    /// свойство.
    /// </summary>
    public IReadOnlyCollection<double>? I2 { get; }

    /// <summary>
    /// операция.
    /// </summary>
    public CurveSet(double vSteppingValue, IReadOnlyCollection<double> v, IReadOnlyCollection<double> i1, IReadOnlyCollection<double>? i2)
    {
        VSteppingValue = vSteppingValue;
        if (v.Count != i1.Count && i2 != null && v.Count != i2.Count)
        {
            throw new ArgumentException("length expected to be equal");
        }

        V = v;
        I1 = i1;
        I2 = i2;
    }
};
