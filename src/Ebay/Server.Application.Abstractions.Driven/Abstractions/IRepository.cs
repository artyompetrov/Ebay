using Server.Domain.Abstractions;

namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Репозиторий для работы агрегатами
/// </summary>
/// <typeparam name="TAggregate">Агрегат</typeparam>
/// <typeparam name="TId">Идентификатор агрегата </typeparam>
public interface IRepository<TAggregate, TId>
    where TAggregate : AggregateRoot<TId>
{
    /// <summary>
    /// Материализовать агрегат
    /// </summary>
    /// <param name="unitOfWork">Unit of Work операции, в контексте которой выполняется вызов.</param>
    /// <param name="id">Идентификатор агрегата</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<TAggregate?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, TId id, CancellationToken cancellationToken);

    /// <summary>
    /// Добавить новый агрегат.
    /// </summary>
    /// <param name="unitOfWork">Unit of Work операции, в контексте которой выполняется вызов.</param>
    /// <param name="aggregate">Инстанс агрегата.</param>
    /// <param name="cancellationToken">Токен отмены.</param>
    Task AddAsync(IWriteModelUnitOfWork unitOfWork, TAggregate aggregate, CancellationToken cancellationToken);

    //todo удаление сейчас выполняется не по DDD что не совсем корректно

    /// <summary>
    /// Удалить агрегат
    /// </summary>
    /// <param name="unitOfWork">Unit of Work операции, в контексте которой выполняется вызов.</param>
    /// <param name="id">Идентификатор агрегата</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, TId id, CancellationToken cancellationToken);

    /// <summary>
    /// Удалить агрегаты
    /// </summary>
    /// <param name="unitOfWork">Unit of Work операции, в контексте которой выполняется вызов.</param>
    /// <param name="id">Идентификаторы агрегата</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<TId> id, CancellationToken cancellationToken);
}