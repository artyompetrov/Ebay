using Server.Domain;
using Server.Domain.Product;

namespace Server.Application.Abstractions.Driven.Abstractions.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата товара.
/// </summary>
public interface IProductRepository : IRepository<Product, Guid>
{

}
