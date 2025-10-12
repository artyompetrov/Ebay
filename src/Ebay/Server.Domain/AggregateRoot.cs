using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using JetBrains.Annotations;

namespace Server.Domain;


public abstract class AggregateRoot<TId> : Entity<TId>, IAggregateRoot
{
    [Timestamp]
    public uint Version { get; [UsedImplicitly]  private set;  }
    
    protected internal AggregateRoot(TId id) : base(id)
    {
    }
    
    private readonly List<object> _domainEvents = new();
    

    internal IReadOnlyCollection<object> DomainEvents => _domainEvents.AsReadOnly();

    protected internal void AddDomainEvent(object domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    internal void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}