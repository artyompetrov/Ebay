namespace Server.Adapters.Driven.MemoryCache;

internal static class WellKnown
{
    /// <summary>
    /// Ключ keyed-регистрации выделенного IMemoryCache для байтов фото/миниатюр замеров и отрендеренных
    /// графиков для eBay. Отдельный от кешей других адаптеров, чтобы ограничение размера этого кеша
    /// не задевало их записи.
    /// </summary>
    public const string ImageCacheServiceKey = "measurement-image-cache";
}
