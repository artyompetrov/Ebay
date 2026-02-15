namespace Server.Domain;

/// <summary>
/// контракт.
/// </summary>
public interface IAuditable
{
    /// <summary>
    /// Дата и время создания сущности.
    /// </summary>
    DateTime CreatedAt { get; set; }
    /// <summary>
    /// Дата и время последнего изменения сущности.
    /// </summary>
    DateTime ChangedAt { get; set; }

}
