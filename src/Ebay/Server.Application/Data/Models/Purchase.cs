using Microsoft.EntityFrameworkCore;

namespace Server.Application.Data.Models;

[PrimaryKey(propertyName: nameof(LotId), nameof(Date))]
public class Purchase
{
    public DateTime Date { get; set; }

    public long LotId { get; set; }
    public Lot Lot { get; set; } = null!;

    public double? Price { get; set; }

    public int Quantity { get; set; }

    public PurchaseCalculationResult? PurchaseCalculationResult { get; set; }
}