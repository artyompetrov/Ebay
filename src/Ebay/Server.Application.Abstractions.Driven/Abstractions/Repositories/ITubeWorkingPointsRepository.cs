using Server.Application.Abstractions.Driven.Abstractions.Abstractions;
using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Driven.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата рабочей точки лампы.
/// </summary>
public interface ITubeWorkingPointsRepository : IRepository<TubeWorkingPoint, Guid>
{

}
