namespace Server.Domain;

public interface IAggregateRoot
{
    uint Version { get; }
    bool HasEvents { get; }
    IReadOnlyCollection<IDomainEvent> GetDomainEvents();
    void ClearDomainEvents();
}
