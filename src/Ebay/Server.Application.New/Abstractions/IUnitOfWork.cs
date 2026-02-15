using System.Data;

namespace Server.Application.New.Abstractions;

/// <summary>
/// Интерфес для работы с транзакциями
/// </summary>
public interface IUnitOfWork
{
    /// <summary>
    /// Сохранить изменения
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);

    Task<IUnitOfWorkTransaction> BeginTransactionAsync(
        CancellationToken cancellationToken,
        IsolationLevel isolationLevel = IsolationLevel.ReadCommitted);
}