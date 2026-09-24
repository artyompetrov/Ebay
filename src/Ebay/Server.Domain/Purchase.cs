namespace Server.Domain;

public sealed class Purchase
{
    private Purchase(DateTimeOffset date, long lotId, double? price, int quantity)
    {
        Date = date;
        LotId = lotId;
        Price = price;
        Quantity = quantity;
    }

    public DateTimeOffset Date { get; }

    public long LotId { get; }

    public double? Price { get; private set; }

    public int Quantity { get; private set; }

    public PurchaseCalculationResult? PurchaseCalculationResult { get; private set; }

    public static Purchase Create(DateTimeOffset date, long lotId, double? price, int quantity) => new(date, lotId, price, quantity);

    public void UpdateAmount(double? price, int quantity)
    {
        Price = price;
        Quantity = quantity;
    }

    public void SetCalculationResult(PurchaseCalculationResult result) => PurchaseCalculationResult = result;
}
