using System.Data;

namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Unit of Work для write-model адаптера: одна операция (сценарий) записи с собственным контекстом БД и
/// транзакционным outbox. Создаётся через <see cref="IWriteModelUnitOfWorkFactory"/> на каждую операцию и
/// передаётся явно в методы репозиториев и издателей; освобождается вызывающим кодом (<c>await using</c>).
/// </summary>
public interface IWriteModelUnitOfWork : IAsyncDisposable
{
    /// <summary>
    /// Публикует накопленные доменные события агрегатов в outbox и сохраняет изменения в write-model.
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