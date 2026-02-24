namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Контракт транзакции Unit of Work.
/// </summary>
public interface IUnitOfWorkTransaction : IDisposable, IAsyncDisposable
{
    /// <summary>
    /// Подтверждает изменения, выполненные в рамках текущей транзакции.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task CommitAsync(CancellationToken cancellationToken);
}