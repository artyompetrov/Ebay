namespace Server.Domain.Measurements;

/// <summary>
/// перечисление.
/// </summary>
public enum MeasurementState
{
    /// <summary>
    /// Замер создан и еще не опубликован.
    /// </summary>
    Created = 0,
    /// <summary>
    /// Замер размещен в продаже.
    /// </summary>
    Selling,
    /// <summary>
    /// Замер продан.
    /// </summary>
    Sold
}
