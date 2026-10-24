using System.ComponentModel.DataAnnotations;

namespace Server.Adapters.Driven.NewAudioPortal;

/// <summary>
/// Настройки сбора объявлений с форума newaudioportal.com.
/// </summary>
public sealed record NewAudioPortalAdapterOptions : IValidatableObject
{
    public const string SectionName = "NewAudioPortal";

    /// <summary>
    /// Разделы форума (путь после <c>/forum/</c>, id и slug), например <c>197-продам-радиолампы</c>; переменные окружения
    /// <c>NewAudioPortal__Sections__0</c>, <c>NewAudioPortal__Sections__1</c>, ... Пустой список означает разделы по умолчанию
    /// (<see cref="WellKnown.DefaultSections"/>): инициализатор массива для этого не годится, потому что binder дописывает
    /// значения из конфигурации к уже существующим элементам, а не заменяет их. Пустые элементы запрещены.
    /// </summary>
    public string[] Sections { get; init; } = [];

    /// <summary>
    /// Пауза после каждого запроса к newaudioportal.com, чтобы не нагружать сайт и не попасть в бан.
    /// </summary>
    [Range(typeof(TimeSpan), "00:00:00", "00:10:00")]
    public TimeSpan RequestDelay { get; init; } = TimeSpan.FromSeconds(5);

    internal IReadOnlyList<string> EffectiveSections => Sections.Length > 0 ? Sections : WellKnown.DefaultSections;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Sections.Any(static x => string.IsNullOrWhiteSpace(x.Trim('/'))))
        {
            yield return new ValidationResult("NewAudioPortal section must not be empty.", [nameof(Sections)]);
        }
    }
}
