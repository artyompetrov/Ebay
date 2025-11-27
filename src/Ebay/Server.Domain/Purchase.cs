namespace Server.Domain;

public class Purchase
{
    public DateTime Date { get; set; }

    public long LotId { get; set; }
    public Lot Lot { get; set; } = null!;

    public double? Price { get; set; }

    public int Quantity { get; set; }

    public PurchaseCalculationResult? PurchaseCalculationResult { get; set; }
}
