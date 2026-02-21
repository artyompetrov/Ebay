using Server.Application.Abstractions.Driven.Abstractions.Abstractions;
using Server.Domain;

namespace Server.Application.Abstractions.Driven.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата товара.
/// </summary>
public interface IProductRepository : IRepository<Product, Guid>
{

}
