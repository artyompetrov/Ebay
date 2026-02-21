using Server.Domain;

namespace Server.Application.Abstractions.Driven.Abstractions.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата товара.
/// </summary>
public interface IProductRepository : IRepository<Product, Guid>
{

}
