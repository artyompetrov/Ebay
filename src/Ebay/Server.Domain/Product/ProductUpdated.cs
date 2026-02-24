using Server.Domain.Abstractions;

namespace Server.Domain.Product;

public record ProductUpdated(Guid ProductId) : IDomainEvent;