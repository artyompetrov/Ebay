using Server.Domain;

namespace Server.Application.Abstractions;

/// <summary>
/// Репозиторий для работы агрегатами
/// </summary>
/// <typeparam name="TAggregate">Агрегат</typeparam>
/// <typeparam name="TId">Идентификатор агрегата </typeparam>
public interface IRepository<TAggregate, in TId> 
    where TAggregate : AggregateRoot<TId>
{
    /// <summary>
    /// Материализовать агрегат
    /// </summary>
    /// <param name="id">Идентификатор агрегата</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<TAggregate?> GetByIdAsync(TId id, CancellationToken cancellationToken);
    
    
    /// <summary>
    /// Сохранить агрегат
    /// </summary>
    /// <param name="aggregate">Инстанс агрегата</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task SaveAsync(TAggregate aggregate, CancellationToken cancellationToken);
    
    /// <summary>
    /// Удалить агрегат
    /// </summary>
    /// <param name="id">Идентификатор агрегата</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task RemoveAsync(TId id, CancellationToken cancellationToken);
}