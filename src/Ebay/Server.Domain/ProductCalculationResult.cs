using System.Text.Json.Serialization;

namespace Server.Domain;

public class ProductCalculationResult
{

    /// <summary>
    /// Общая выручка для всех продаж
    /// </summary>
    public required double Revenue { get; init; }

    /// <summary>
    /// Общее количество штук продано
    /// </summary>
    public required int QuantityTotal { get; init; }

    /// <summary>
    /// Дата расчета (равно меньшему из всех дочерних расчетов)
    /// </summary>
    public required DateTime CalculationDate { get; init; }


    /// <summary>
    /// суммарная цена листингов
    /// </summary>
    public required double ListingPriceSumm { get; init; }

    /// <summary>
    /// Средняя выручка для продукта
    /// </summary>
    [JsonIgnore]
    public double RevenueAvg
    {
        get
        {
            if (QuantityTotal == 0.0) return 0.0;
            return Revenue / QuantityTotal;
        }
    }

    /// <summary>
    /// Средняя цена листинга для продукта
    /// </summary>
    [JsonIgnore]
    public double ListingPriceAvg
    {
        get
        {
            if (QuantityTotal == 0.0) return 0.0;
            return ListingPriceSumm / QuantityTotal;
        }
    }
}