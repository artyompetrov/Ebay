using System.ComponentModel.DataAnnotations;

namespace Server.Adapters.Driven.Qrz;

/// <summary>
/// Настройки сбора объявлений с доски qrz.ru.
/// </summary>
public sealed record QrzAdapterOptions
{
    public const string SectionName = "Qrz";

    /// <summary>
    /// Категории доски объявлений (путь после <c>/classifieds/category/</c>), например <c>components/tubes</c>;
    /// переменные окружения <c>Qrz__Categories__0</c>, <c>Qrz__Categories__1</c>, ... Пустой список означает
    /// категории по умолчанию (<see cref="WellKnown.DefaultCategories"/>): инициализатор массива для этого не годится,
    /// потому что binder дописывает значения из конфигурации к уже существующим элементам, а не заменяет их.
    /// </summary>
    public string[] Categories { get; init; } = [];

    /// <summary>
    /// Пауза после каждого запроса к qrz.ru, чтобы не нагружать сайт и не попасть в бан.
    /// </summary>
    [Range(typeof(TimeSpan), "00:00:00", "00:10:00")]
    public TimeSpan RequestDelay { get; init; } = TimeSpan.FromSeconds(5);

    internal IReadOnlyList<string> EffectiveCategories => Categories.Length > 0 ? Categories : WellKnown.DefaultCategories;
}
