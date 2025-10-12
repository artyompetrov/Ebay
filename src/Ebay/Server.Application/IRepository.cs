using Server.Domain;

namespace Server.Application;

public interface IRepository<TAggregate, in TId> 
    where TAggregate : AggregateRoot<TId>
{
    Task<TAggregate?> GetByIdAsync(TId id, CancellationToken cancellationToken);
    
    Task SaveAsync(TAggregate aggregate, CancellationToken cancellationToken);
    
    Task RemoveAsync(TId id, CancellationToken cancellationToken);
}