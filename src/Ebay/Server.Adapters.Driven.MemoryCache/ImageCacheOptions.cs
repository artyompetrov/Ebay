namespace Server.Adapters.Driven.MemoryCache;

/// <summary>
/// Настройки общего in-memory кеша, используемого для фото/миниатюр замеров и для
/// отрендеренных графиков/описаний, показываемых на странице лота eBay.
/// </summary>
internal sealed record ImageCacheOptions
{
    private const long DefaultSizeLimitBytes = 200 * 1024 * 1024;

    public const string SectionName = "ImageCache";

    /// <summary>
    /// Максимальный суммарный размер (в байтах) записей, удерживаемых в кеше одновременно.
    /// </summary>
    public long SizeLimitBytes { get; init; } = DefaultSizeLimitBytes;
}
