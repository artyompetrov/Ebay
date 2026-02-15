using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Domain;

/// <summary>
/// класс доменной модели.
/// </summary>
public class Currency
{
    /// <summary>
    /// свойство.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public string CurrencyEbayName { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public string CurrencyRusName { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public string CurrencyApiName { get; set; } = null!;

    /// <summary>
    /// Цена одного доллара в данной валюте
    /// </summary>
    public double CurrencyRate { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public DateTime LastUpdate { get; set; }
}
