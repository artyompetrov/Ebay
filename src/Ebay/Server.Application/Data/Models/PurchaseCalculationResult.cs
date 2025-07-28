using System.Text.Json.Serialization;

namespace Server.Application.Data.Models;

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
    /// Средняя выручка для продажи
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
}