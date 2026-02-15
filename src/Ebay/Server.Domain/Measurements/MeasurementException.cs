namespace Server.Domain.Measurements;

/// <summary>
/// класс доменной модели.
/// </summary>
public class MeasurementException : Exception
{
    /// <summary>
    /// операция.
    /// </summary>
    public MeasurementException(string message)
        : base(message)
    {
    }
}
