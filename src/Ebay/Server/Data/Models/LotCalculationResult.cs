using Newtonsoft.Json;

namespace Server.Data.Models;

public class LotCalculationResult
{
    /// <summary>
    /// выручкаСПродажЛотаВДолларах
    /// </summary>
    public double Revenue { get; set; }
    
    /// <summary>
    /// общееКоличествоШтукВоВсехПродажах
    /// </summary>
    public int QuantityTotal { get; set; }
    
    /// <summary>
    /// Дата расчета
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