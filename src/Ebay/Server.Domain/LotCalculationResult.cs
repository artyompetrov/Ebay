using System.Text.Json.Serialization;

namespace Server.Domain;

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
    /// сумма цена листинга лота
    /// </summary>
    public double ListingPriceSumm { get; set; }

    /// <summary>
    /// Дата расчета
    /// </summary>
    public DateTime CalculationDate { get; set; }

    /// <summary>
    /// Средняя выручка для лота (после вычета всех расходов)
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
    /// Средняя цена листинга для лота (цена по которой надо выставлять штуку)
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