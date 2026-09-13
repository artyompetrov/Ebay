namespace Server.Application;

/// <summary>
/// Настройки общего in-memory кеша, используемого для фото/миниатюр замеров и для
/// отрендеренных графиков/описаний, показываемых на странице лота eBay.
/// </summary>
public sealed record ImageCacheOptions
{
    public const string SectionName = "ImageCache";

    private const long DefaultSizeLimitBytes = 200 * 1024 * 1024;

    /// <summary>
    /// Максимальный суммарный размер (в байтах) записей, удерживаемых в кеше одновременно.
    /// </summary>
    public long SizeLimitBytes { get; init; } = DefaultSizeLimitBytes;
}
