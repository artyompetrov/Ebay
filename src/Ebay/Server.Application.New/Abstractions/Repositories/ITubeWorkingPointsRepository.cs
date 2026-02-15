using Server.Domain.Measurements;

namespace Server.Application.New.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата рабочей точки лампы.
/// </summary>
public interface ITubeWorkingPointsRepository : IRepository<TubeWorkingPoint, Guid>
{

}
