using System.Text.Json.Serialization;

namespace Server.Data.Models;

public class ProductCalculationResult
{
    /// <summary>
    /// выручкаСПродажиВДолларах
    /// </summary>
    public double Revenue { get; set; }

    /// <summary>
    /// общееКоличествоШтукВоВсехПродажах
    /// </summary>
    public int QuantityTotal { get; set; }

    /// <summary>
    /// Дата расчета (равно меньшему из всех дочерних расчетов)
    /// </summary>
    public DateTime CalculationDate { get; set; }

    /// <summary>
    /// Средняя выручка для лота
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