namespace Server.Application.New.Abstractions.Repositories

open System
open Server.Application.New.Abstractions
open Server.Domain.Measurements

/// <summary>
/// Репозиторий агрегата рабочей точки лампы.
/// </summary>
type ITubeWorkingPointsRepository =
    inherit IRepository<TubeWorkingPoint, Guid>
