using System.ComponentModel.DataAnnotations;

namespace Server.Adapters.Driven.Qrz;

/// <summary>
/// Настройки сбора объявлений с доски qrz.ru.
/// </summary>
public sealed record QrzAdapterOptions : IValidatableObject
{
    public const string SectionName = "Qrz";

    /// <summary>
    /// Категории доски объявлений (путь после <c>/classifieds/category/</c>), например <c>components/tubes</c>;
    /// переменные окружения <c>Qrz__Categories__0</c>, <c>Qrz__Categories__1</c>, ... Пустой список означает
    /// категории по умолчанию (<see cref="WellKnown.DefaultCategories"/>): инициализатор массива для этого не годится,
    /// потому что binder дописывает значения из конфигурации к уже существующим элементам, а не заменяет их.
    /// Пустые элементы запрещены.
    /// </summary>
    public string[] Categories { get; init; } = [];

    /// <summary>
    /// Пауза после каждого запроса к qrz.ru, чтобы не нагружать сайт и не попасть в бан.
    /// </summary>
    [Range(typeof(TimeSpan), "00:00:00", "00:10:00")]
    public TimeSpan RequestDelay { get; init; } = TimeSpan.FromSeconds(5);

    /// <summary>
    /// Окно свежести списка: следующая страница списка читается, пока на текущей есть объявления не старше этого окна.
    /// Должно покрывать период опроса плюс длительность прогона с запасом, иначе массовое поднятие объявлений
    /// между прогонами вытеснит свежие объявления за пределы прочитанных страниц. Нижняя граница - период опроса
    /// (30 минут): более короткое окно незаметно отключило бы чтение следующих страниц.
    /// </summary>
    [Range(typeof(TimeSpan), "00:30:00", "7.00:00:00")]
    public TimeSpan ListLookback { get; init; } = TimeSpan.FromHours(2);

    /// <summary>
    /// Предел числа страниц списка на категорию и тип объявления за прогон, чтобы не уйти в глубину списка
    /// при неожиданной разметке или очень массовом поднятии.
    /// </summary>
    [Range(1, 100)]
    public int MaxListPages { get; init; } = 10;

    internal IReadOnlyList<string> EffectiveCategories => Categories.Length > 0 ? Categories : WellKnown.DefaultCategories;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Categories.Any(static x => string.IsNullOrWhiteSpace(x.Trim('/'))))
        {
            yield return new ValidationResult("Qrz category must not be empty.", [nameof(Categories)]);
        }
    }
}
