using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Domain;

/// <summary>
/// класс доменной модели.
/// </summary>
public class Lot
{
    /// <summary>
    /// свойство.
    /// </summary>
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public long Id { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public Guid ProductId { get; set; }
    /// <summary>
    /// свойство.
    /// </summary>
    public Product Product { get; set; } = null!;

    // Тоже самое, что и title, но в коде везде ипользуется Name
    /// <summary>
    /// свойство.
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public int Pcs { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public int? LotSize { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    [ForeignKey("CurrencyEbayName")]
    public string CurrencyId { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public Currency Currency { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public string ShippingCountry { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public double Price { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public double Shipping { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public double ShippingAdditional { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public string Description { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public string? ShortDescription { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public string Condition { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public string? ConditionDescription { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public string Seller { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public string LocatedIn { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public DateTime TitleChangeDate { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public DateTime UpdateDate { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public Dictionary<string, string> Categories { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public List<Purchase> Purchases { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public LotCalculationResult? LotCalculationResult { get; set; }
}
