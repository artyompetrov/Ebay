using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driven.Abstractions.Queries;

/// <summary>
/// Узкий порт чтения карточки одного замера, для сценариев, которым не нужен весь <see cref="IMeasurementQueries"/>.
/// </summary>
public interface IMeasurementInfoQueries
{
    /// <summary>
    /// Возвращает карточку замера без бинарных данных.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Карточка замера либо <see langword="null" />, если замер не найден.</returns>
    Task<MeasurementInfo?> GetMeasurementInfo(string measurementId, CancellationToken cancellationToken);
}