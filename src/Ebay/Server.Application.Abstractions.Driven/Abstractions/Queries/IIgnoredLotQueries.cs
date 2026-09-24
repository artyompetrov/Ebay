namespace Server.Application.Abstractions.Driven.Abstractions.Queries;

/// <summary>
/// Порт чтения отметок об игнорируемых лотах.
/// </summary>
public interface IIgnoredLotQueries
{
    /// <summary>
    /// Возвращает идентификаторы лотов, проигнорированных для товара.
    /// </summary>
    Task<IReadOnlyList<long>> GetIgnoredLotIdsAsync(Guid productId, CancellationToken cancellationToken);

    /// <summary>
    /// Проверяет, проигнорирован ли лот для товара.
    /// </summary>
    Task<bool> IsLotIgnoredAsync(Guid productId, long lotId, CancellationToken cancellationToken);
}
