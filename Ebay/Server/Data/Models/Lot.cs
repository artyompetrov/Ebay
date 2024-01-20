namespace Ebay.Server.Data.Models;

public class Lot
{
    public int Id { get; set; }

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

    public List<Purchase> Purchases { get; set; } = null!;
}