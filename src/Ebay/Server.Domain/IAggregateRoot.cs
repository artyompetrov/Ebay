namespace Server.Domain;

public interface IAggregateRoot
{
    uint Version { get; }
}
