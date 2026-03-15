namespace Server.Domain.Abstractions;

/// <summary>
/// Базовый тип сущности домена.
/// </summary>
/// <typeparam name="TId">Тип идентификатора сущности.</typeparam>
public abstract class Entity<TId> : IAuditable
{
    protected Entity(TId id)
    {
        Id = id;
    }

    /// <summary>
    /// Время создания сущности в UTC.
    /// Сеттер намеренно открыт, потому что эти технические audit-поля проставляются на уровне EF DbContext
    /// через ApplyAudit(), а не бизнес-методами агрегатов.
    /// </summary>
    public DateTimeOffset CreatedAt { get; set; }

    /// <summary>
    /// Время последнего изменения сущности в UTC.
    /// Сеттер намеренно открыт по той же причине: значение централизованно обновляется инфраструктурным слоем при SaveChanges.
    /// </summary>
    public DateTimeOffset ChangedAt { get; set; }

    public TId Id { get; }

    public override bool Equals(object? obj) => obj is Entity<TId> other && (ReferenceEquals(this, other) || EqualityComparer<TId>.Default.Equals(Id, other.Id));

    public override int GetHashCode() => Id?.GetHashCode() ?? 0;
}