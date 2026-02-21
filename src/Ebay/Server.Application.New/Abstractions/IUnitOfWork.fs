namespace Server.Application.New.Abstractions

open System.Data
open System.Runtime.InteropServices
open System.Threading
open System.Threading.Tasks

/// <summary>
/// Контракт Unit of Work для сохранения изменений и управления транзакциями.
/// </summary>
type IUnitOfWork =
    /// <summary>
    /// Сохраняет все накопленные изменения в хранилище.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Количество измененных записей.</returns>
    abstract SaveChangesAsync: cancellationToken: CancellationToken -> Task<int>

    /// <summary>
    /// Открывает транзакцию для группы операций записи.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <param name="isolationLevel">Уровень изоляции транзакции.</param>
    /// <returns>Дескриптор активной транзакции.</returns>
    abstract BeginTransactionAsync:
        cancellationToken: CancellationToken *
        [<Optional; DefaultParameterValue(IsolationLevel.ReadCommitted)>] isolationLevel: IsolationLevel
            -> Task<IUnitOfWorkTransaction>
