namespace Server.Application.New.Abstractions

open System
open System.Threading
open System.Threading.Tasks

/// <summary>
/// Контракт транзакции Unit of Work.
/// </summary>
type IUnitOfWorkTransaction =
    inherit IDisposable
    inherit IAsyncDisposable

    /// <summary>
    /// Подтверждает изменения, выполненные в рамках текущей транзакции.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    abstract CommitAsync: cancellationToken: CancellationToken -> Task
