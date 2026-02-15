namespace Server.Domain;

/// <summary>
/// класс доменной модели.
/// </summary>
public class Purchase
{
    /// <summary>
    /// свойство.
    /// </summary>
    public DateTime Date { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public long LotId { get; set; }
    /// <summary>
    /// свойство.
    /// </summary>
    public Lot Lot { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public double? Price { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public int Quantity { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public PurchaseCalculationResult? PurchaseCalculationResult { get; set; }
}
