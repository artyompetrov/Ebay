using System.Text.Json.Serialization;

namespace Server.Domain;

/// <summary>
/// класс доменной модели.
/// </summary>
public class PurchaseCalculationResult
{
    /// <summary>
    /// выручкаСПродажиВДолларах
    /// </summary>
    public double Revenue { get; set; }

    /// <summary>
    /// общееКоличествоШтукВПродаже
    /// </summary>
    public int QuantityTotal { get; set; }

    /// <summary>
    /// Дата расчета
    /// </summary>
    public DateTime CalculationDate { get; set; }

    /// <summary>
    /// Цена листинга
    /// </summary>
    public double ListingPrice { get; set; }

    /// <summary>
    /// Средняя выручка для продажи
    /// </summary>
    /// <summary>
    /// свойство.
    /// </summary>
    [JsonIgnore]
    public double RevenueAvg => QuantityTotal == 0.0 ? 0.0 : Revenue / QuantityTotal;

    /// <summary>
    /// Средняя цена листинга
    /// </summary>
    /// <summary>
    /// свойство.
    /// </summary>
    [JsonIgnore]
    public double ListingPriceAvg => QuantityTotal == 0.0 ? 0.0 : ListingPrice / QuantityTotal;
}
