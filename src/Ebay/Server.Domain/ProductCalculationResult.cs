using System.Text.Json.Serialization;

namespace Server.Domain;

public class ProductCalculationResult
{

    /// <summary>
    /// Общая выручка для всех продаж
    /// </summary>
    public double Revenue { get; init; }

    /// <summary>
    /// Общее количество штук продано
    /// </summary>
    public int QuantityTotal { get; init; }

    /// <summary>
    /// Дата расчета (равно меньшему из всех дочерних расчетов)
    /// </summary>
    public DateTime CalculationDate { get; init; }


    /// <summary>
    /// суммарная цена листингов
    /// </summary>
    public double ListingPriceSumm { get; init; }

    /// <summary>
    /// Средняя выручка для продукта
    /// </summary>
    [JsonIgnore]
    public double RevenueAvg => QuantityTotal == 0.0 ? 0.0 : Revenue / QuantityTotal;

    /// <summary>
    /// Средняя цена листинга для продукта
    /// </summary>
    [JsonIgnore]
    public double ListingPriceAvg => QuantityTotal == 0.0 ? 0.0 : ListingPriceSumm / QuantityTotal;
}