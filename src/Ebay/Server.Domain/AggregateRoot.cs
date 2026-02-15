using JetBrains.Annotations;

namespace Server.Domain;

/// <summary>
/// класс доменной модели.
/// </summary>
public abstract class AggregateRoot<TId> : Entity<TId>, IAggregateRoot
{
    /// <summary>
    /// свойство.
    /// </summary>
    public uint Version { get; [UsedImplicitly] private set; }

    /// <summary>
    /// Инициализирует корень агрегата идентификатором.
    /// </summary>
    protected internal AggregateRoot(TId id) : base(id)
    {
    }

    private readonly List<object> _domainEvents = [];


    internal IReadOnlyCollection<object> DomainEvents => _domainEvents.AsReadOnly();

    /// <summary>
    /// Добавляет доменное событие в буфер агрегата.
    /// </summary>
    protected internal void AddDomainEvent(object domainEvent) => _domainEvents.Add(domainEvent);

    internal void ClearDomainEvents() => _domainEvents.Clear();


}
