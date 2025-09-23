using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Domain;

public class Lot
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public long Id { get; set; }

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    // Тоже самое, что и title, но в коде везде ипользуется Name
    public string Name { get; set; } = null!;

    public int Pcs { get; set; }

    public int? LotSize { get; set; } = null;

    [ForeignKey("CurrencyEbayName")]
    public string CurrencyId { get; set; } = null!;

    public Currency Currency { get; set; } = null!;

    public string ShippingCountry { get; set; } = null!;

    public double Price { get; set; }

    public double Shipping { get; set; }

    public double ShippingAdditional { get; set; }

    public string Description { get; set; } = null!;

    public string? ShortDescription { get; set; }

    public string Condition { get; set; } = null!;

    public string? ConditionDescription { get; set; }

    public string Seller { get; set; } = null!;

    public string LocatedIn { get; set; } = null!;

    public DateTime TitleChangeDate { get; set; }

    public DateTime UpdateDate { get; set; }

    public Dictionary<string, string> Categories { get; set; } = null!;

    public List<Purchase> Purchases { get; set; } = null!;

    public LotCalculationResult? LotCalculationResult { get; set; }
}