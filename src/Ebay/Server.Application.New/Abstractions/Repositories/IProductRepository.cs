using Server.Domain;

namespace Server.Application.New.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата товара.
/// </summary>
public interface IProductRepository : IRepository<Product, Guid>
{

}
