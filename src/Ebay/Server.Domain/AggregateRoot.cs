namespace Server.Domain;

public abstract class AggregateRoot<TId> : Entity<TId>, IAggregateRoot
{
    
    protected AggregateRoot(TId id) : base(id)
    {
    }
    
    private readonly List<object> _domainEvents = new();



    public IReadOnlyCollection<object> DomainEvents => _domainEvents.AsReadOnly();

    protected void AddDomainEvent(object domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}