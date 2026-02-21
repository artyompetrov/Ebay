namespace Server.Domain;

public interface IAggregateRoot
{
    uint Version { get; }
    IReadOnlyCollection<object> GetDomainEvents();
    void ClearDomainEvents();
}
