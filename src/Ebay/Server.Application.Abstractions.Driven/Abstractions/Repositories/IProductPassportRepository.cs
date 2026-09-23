using Server.Domain;

namespace Server.Application.Abstractions.Driven.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата паспорта товара.
/// </summary>
public interface IProductPassportRepository : IRepository<ProductPassport, Guid>
{
}
