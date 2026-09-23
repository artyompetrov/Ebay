using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driven.Abstractions.Queries;

/// <summary>
/// Порт чтения данных лотов (объявлений о продаже).
/// </summary>
public interface ILotQueries
{
    /// <summary>
    /// Возвращает лоты товара вместе с историей покупок.
    /// </summary>
    Task<IReadOnlyList<LotDetails>> GetLotsForProductAsync(Guid productId, CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает лот вместе с историей покупок.
    /// </summary>
    Task<LotDetails?> GetLotAsync(long lotId, CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает идентификаторы всех лотов.
    /// </summary>
    Task<IReadOnlyList<long>> GetAllLotIdsAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает идентификаторы лотов товара.
    /// </summary>
    Task<IReadOnlyList<long>> GetLotIdsForProductAsync(Guid productId, CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает дату последнего обновления для каждого из запрошенных лотов.
    /// </summary>
    Task<IReadOnlyList<LotUpdateInfo>> GetLotUpdateInfoAsync(IReadOnlySet<long> lotIds, CancellationToken cancellationToken);

    /// <summary>
    /// Проверяет, что хотя бы один из указанных лотов уже сохранен для товара.
    /// </summary>
    Task<bool> AnyLotExistsForProductAsync(Guid productId, IReadOnlySet<long> lotIds, CancellationToken cancellationToken);
}
