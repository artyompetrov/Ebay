namespace Server.Data.Models;

internal class LotCalculationResult
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
    /// Средняя выручка для лота
    /// </summary>
    public double RevenueAvg => Revenue / QuantityTotal;
}