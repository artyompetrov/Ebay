namespace Server.Application.Abstractions.Driven.Abstractions.Repositories;

/// <summary>
/// Репозиторий отметок об игнорируемых лотах.
/// </summary>
public interface IIgnoredLotRepository
{
    /// <summary>
    /// Добавляет отметки об игнорировании для лотов, для которых их ещё нет.
    /// </summary>
    Task InsertMissingAsync(Guid productId, IReadOnlySet<long> lotIds, CancellationToken cancellationToken);

    /// <summary>
    /// Удаляет отметку об игнорировании лота, если она есть.
    /// </summary>
    Task RemoveAsync(Guid productId, long lotId, CancellationToken cancellationToken);
}
