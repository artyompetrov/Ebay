using Server.Domain.Measurements;

namespace Server.Application.New.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата разницы между замерами для задач подбора пар.
/// </summary>
public interface IMatchedPairDifferenceRepository : IRepository<MatchedPairDifference, MatchedPairDifferenceId>
{
    /// <summary>
    /// Удаляет все записи разниц, связанные с указанными идентификаторами замеров.
    /// </summary>
    /// <param name="measurementIds">Идентификаторы замеров.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task RemoveByMeasurementIds(IReadOnlySet<string> measurementIds, CancellationToken cancellationToken);
}
