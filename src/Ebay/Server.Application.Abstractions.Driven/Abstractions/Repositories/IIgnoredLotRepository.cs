namespace Server.Application.Abstractions.Driven.Abstractions.Repositories;

/// <summary>
/// Репозиторий отметок об игнорируемых лотах.
/// </summary>
public interface IIgnoredLotRepository
{
    /// <summary>
    /// Добавляет отметки об игнорировании для лотов, для которых их ещё нет. Устойчиво к параллельной вставке
    /// той же пары; сохранение (<see cref="IWriteModelUnitOfWork.SaveChangesAsync"/>) остаётся за вызывающим кодом.
    /// </summary>
    Task InsertMissingAsync(IWriteModelUnitOfWork unitOfWork, Guid productId, IReadOnlySet<long> lotIds, CancellationToken cancellationToken);

    /// <summary>
    /// Удаляет отметку об игнорировании лота, если она есть.
    /// </summary>
    Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, Guid productId, long lotId, CancellationToken cancellationToken);
}
