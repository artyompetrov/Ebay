using Server.Application.New.Models;

namespace Server.Application.New.Abstractions.Queries;

/// <summary>
/// Порт чтения рабочей точки лампы для товара.
/// </summary>
public interface ITubeWorkingPointQueries
{
    /// <summary>
    /// Возвращает параметры рабочей точки лампы для товара.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Информация о рабочей точке либо <see langword="null" />, если она не задана.</returns>
    Task<TubeWorkingPointInfo?> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken);
}
