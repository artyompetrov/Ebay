using System.Data;

namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Unit of Work для write-model адаптера.
/// </summary>
public interface IWriteModelUnitOfWork
{
    /// <summary>
    /// Сохраняет изменения в write-model.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
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