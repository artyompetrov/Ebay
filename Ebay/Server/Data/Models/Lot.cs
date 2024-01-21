using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ebay.Server.Data.Models;

public class Lot
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public long Id { get; set; }

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int Pcs { get; set; }

    public double Price { get; set; }

    public double Shipping { get; set; }

    public double ShippingAdditional { get; set; }

    public string Description { get; set; } = null!;

    public string Condition { get; set; } = null!;

    public string ConditionDescription { get; set; } = null!;

    public string Seller { get; set; } = null!;

    public string LocatedIn { get; set; } = null!;
    
    public DateTime UpdateDate { get; set; }

    public List<Purchase> Purchases { get; set; } = null!;
}