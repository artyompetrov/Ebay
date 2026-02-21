namespace Server.Application.New.Abstractions.Repositories

open System.Collections.Generic
open System.Threading
open System.Threading.Tasks
open Server.Application.New.Abstractions
open Server.Domain.Measurements

/// <summary>
/// Репозиторий агрегата разницы между замерами для задач подбора пар.
/// </summary>
type IMatchedPairDifferenceRepository =
    inherit IRepository<MatchedPairDifference, MatchedPairDifferenceId>

    /// <summary>
    /// Удаляет все записи разниц, связанные с указанными идентификаторами замеров.
    /// </summary>
    /// <param name="measurementIds">Идентификаторы замеров.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    abstract RemoveByMeasurementIds:
        measurementIds: IReadOnlySet<string> *
        cancellationToken: CancellationToken
            -> Task
