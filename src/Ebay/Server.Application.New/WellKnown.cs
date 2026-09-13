namespace Server.Application.New;

/// <summary>
/// Константы application-слоя.
/// </summary>
public static class WellKnown
{
    /// <summary>
    /// Время проверки товаров на ebay
    /// </summary>
    public const int RecheckTimeInDays = 360 * 2;

    /// <summary>
    /// Сумма выручки за штуку от которой интересно работать с товаром
    /// </summary>
    public const int IsInterestingRevenueUsd = 12;

    /// <summary>
    /// Количество штук на ebay продано минимум, для репрезентативности
    /// </summary>
    public const int IsInterestingRelevantStatistics = 3;

    /// <summary>
    /// Коэффициент увеличения веса товара для расчета логистики Ebay.
    /// </summary>
    public const double EbayWeightMultiplier = 1.5;

    public static class ImageCache
    {
        /// <summary>
        /// Ключ keyed-регистрации выделенного <see cref="Microsoft.Extensions.Caching.Memory.IMemoryCache"/>
        /// для байтов фото/миниатюр непроданных замеров и отрендеренных графиков для eBay. Отдельный от
        /// service-wide кеша (используемого, например, GeoIP-логированием), чтобы ограничение размера
        /// этого кеша не задевало записи, которые не проставляют Size.
        /// </summary>
        public const string ServiceKey = "measurement-image-cache";
    }

    public static class PhotoBackfill
    {
        /// <summary>
        /// Размер батча для одноразового приведения уже сохранённых "оригиналов" фото замеров
        /// к ограничению по размеру. Ограничивает, сколько байтов фото одновременно живёт
        /// в памяти и отслеживается EF change tracker'ом за один проход.
        /// </summary>
        public const int BatchSize = 100;
    }
}