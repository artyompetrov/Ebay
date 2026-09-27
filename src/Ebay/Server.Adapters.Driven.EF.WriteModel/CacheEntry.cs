using System.ComponentModel.DataAnnotations;

namespace Server.Adapters.Driven.EF.WriteModel;

/// <summary>
/// Строка персистентного кеша, используемая исключительно <see cref="DbCache"/> - деталь его хранения,
/// не доменные данные.
/// </summary>
internal sealed class CacheEntry
{
    [MaxLength(500)]
    public string Key { get; set; } = null!;

    [MaxLength(50)]
    [Required]
    public string Version { get; set; } = null!;

    [Required]
    public string Value { get; set; } = null!;

    [Required]
    public DateTimeOffset ExpiresAt { get; set; }
}
