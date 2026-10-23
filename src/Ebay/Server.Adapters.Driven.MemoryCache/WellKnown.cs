namespace Server.Adapters.Driven.MemoryCache;

internal static class WellKnown
{
    /// <summary>
    /// Ключ keyed-регистрации выделенного IMemoryCache для байтов фото/миниатюр замеров и отрендеренных
    /// графиков для eBay. Отдельный от кешей других адаптеров, чтобы ограничение размера этого кеша
    /// не задевало их записи.
    /// </summary>
    public const string ImageCacheServiceKey = "measurement-image-cache";

    /// <summary>Span source and span names of cache lookups (<c>openspec/specs/observability-tracing</c>).</summary>
    public static class Tracing
    {
        /// <summary>Exported by the platform because the name starts with <c>Server.</c>.</summary>
        public const string ActivitySourceName = "Server.Adapters.Driven.MemoryCache";

        public const string GetOrCreateSpan = "measurement-content-cache.get";

        /// <summary>Same attribute name as the ChipFind and Qrz adapters' cache lookups.</summary>
        public const string CacheHitTag = "cache.hit";

        public const string CacheKeyTag = "cache.key";

        public const string MeasurementIdTag = "measurement.id";
    }
}
