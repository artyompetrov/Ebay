using Server.Domain;

namespace Server.Application;

public interface IRepository<TAggregate, in TId> 
    where TAggregate : AggregateRoot<TId>
{
    Task<TAggregate?> GetByIdAsync(TId id, CancellationToken ct);
    
    Task SaveAsync(TAggregate aggregate, CancellationToken ct);
    
    Task RemoveAsync(TId id, CancellationToken ct);
}