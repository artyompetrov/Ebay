using Server.Domain;

namespace Server.Application.Abstractions.Driven.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата лота.
/// </summary>
public interface ILotRepository : IRepository<Lot, long>
{
}
