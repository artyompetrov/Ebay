using System.Data;

namespace Server.Application.Abstractions.Driven.Abstractions.Abstractions;

/// <summary>
/// Контракт Unit of Work для сохранения изменений и управления транзакциями.
/// </summary>
public interface IUnitOfWork
{
    /// <summary>
    /// Сохраняет все накопленные изменения в хранилище.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Количество измененных записей.</returns>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Открывает транзакцию для группы операций записи.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <param name="isolationLevel">Уровень изоляции транзакции.</param>
    /// <returns>Дескриптор активной транзакции.</returns>
    Task<IUnitOfWorkTransaction> BeginTransactionAsync(
        CancellationToken cancellationToken,
        IsolationLevel isolationLevel = IsolationLevel.ReadCommitted);
}
