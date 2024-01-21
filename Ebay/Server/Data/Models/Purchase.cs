using System.ComponentModel.DataAnnotations;

namespace Ebay.Server.Data.Models;

public class Purchase
{
    [Key]
    public DateTime Date { get; set; }

    public long LotId { get; set; }
    public Lot Lot { get; set; } = null!;

    public double? Price { get; set; }

    public int Quantity { get; set; }
}