using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Driven.Abstractions.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата рабочей точки лампы.
/// </summary>
public interface ITubeWorkingPointsRepository : IRepository<TubeWorkingPoint, Guid>
{

}
