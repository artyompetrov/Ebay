namespace Server.Domain;

/// <summary>
/// класс доменной модели.
/// </summary>
public abstract class Entity<TId>
{
    /// <summary>
    /// Создает сущность с заданным идентификатором.
    /// </summary>
    protected Entity(TId id)
    {
        Id = id;
    }

    /// <summary>
    /// свойство.
    /// </summary>
    public DateTime CreatedAt { get; private set; }
    /// <summary>
    /// свойство.
    /// </summary>
    public DateTime ChangedAt { get; private set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public TId Id { get; }

    /// <summary>
    /// операция.
    /// </summary>
    public override bool Equals(object? obj) => obj is Entity<TId> other && (ReferenceEquals(this, other) || EqualityComparer<TId>.Default.Equals(Id, other.Id));

    /// <summary>
    /// операция.
    /// </summary>
    public override int GetHashCode() => Id?.GetHashCode() ?? 0;
}
