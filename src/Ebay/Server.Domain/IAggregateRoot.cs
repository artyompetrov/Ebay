namespace Server.Domain;

/// <summary>
/// контракт.
/// </summary>
public interface IAggregateRoot
{
    /// <summary>
    /// Версия агрегата для оптимистичной блокировки.
    /// </summary>
    uint Version { get; }
}
