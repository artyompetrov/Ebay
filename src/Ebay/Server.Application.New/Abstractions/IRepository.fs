namespace Server.Application.New.Abstractions

open System.Collections.Generic
open System.Threading
open System.Threading.Tasks
open Server.Domain

/// <summary>
/// Репозиторий для работы агрегатами
/// </summary>
/// <typeparam name="TAggregate">Агрегат</typeparam>
/// <typeparam name="TId">Идентификатор агрегата </typeparam>
type IRepository<'TAggregate, 'TId when 'TAggregate :> AggregateRoot<'TId>> =
    /// <summary>
    /// Материализовать агрегат
    /// </summary>
    /// <param name="id">Идентификатор агрегата</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    abstract GetByIdAsync: id: 'TId * cancellationToken: CancellationToken -> Task<'TAggregate>

    /// <summary>
    /// Сохранить агрегат
    /// </summary>
    /// <param name="aggregate">Инстанс агрегата</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    abstract SaveAsync: aggregate: 'TAggregate * cancellationToken: CancellationToken -> Task

    //todo удаление сейчас выполняется не по DDD что не совсем корректно

    /// <summary>
    /// Удалить агрегат
    /// </summary>
    /// <param name="id">Идентификатор агрегата</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    abstract RemoveAsync: id: 'TId * cancellationToken: CancellationToken -> Task

    /// <summary>
    /// Удалить агрегаты
    /// </summary>
    /// <param name="id">Идентификаторы агрегата</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    abstract RemoveAsync: id: IReadOnlySet<'TId> * cancellationToken: CancellationToken -> Task
