namespace Server.Domain;

public record ProductUpdated(Guid ProductId) : IDomainEvent;
