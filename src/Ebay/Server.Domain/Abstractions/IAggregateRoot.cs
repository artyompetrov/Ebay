namespace Server.Domain.Abstractions;

public interface IAggregateRoot
{
    uint Version { get; }
    bool HasEvents { get; }
    IReadOnlyCollection<IDomainEvent> GetDomainEvents();
}