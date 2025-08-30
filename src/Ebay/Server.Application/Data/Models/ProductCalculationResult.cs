using System.Text.Json.Serialization;

namespace Server.Application.Data.Models;

public class ProductCalculationResult
{
    /// <summary>
    /// Общая выручка для всех продаж
    /// </summary>
    public double Revenue { get; set; }

    /// <summary>
    /// Общее количество штук продано
    /// </summary>
    public int QuantityTotal { get; set; }

    /// <summary>
    /// Дата расчета (равно меньшему из всех дочерних расчетов)
    /// </summary>
    public DateTime CalculationDate { get; set; }
    
    
    /// <summary>
    /// суммарная цена листингов
    /// </summary>
    public double ListingPriceSumm { get; set; }

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