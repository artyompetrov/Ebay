using Newtonsoft.Json;

namespace Server.Data.Models;

internal class PurchaseCalculationResult
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