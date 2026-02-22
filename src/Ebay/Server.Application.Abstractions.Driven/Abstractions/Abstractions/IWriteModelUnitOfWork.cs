namespace Server.Application.Abstractions.Driven.Abstractions.Abstractions;

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
}
