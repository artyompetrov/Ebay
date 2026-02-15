using Server.Domain;

namespace Server.Application.New.Abstractions.Repositories;

/// <summary>
/// контракт.
/// </summary>
public interface IProductRepository : IRepository<Product, Guid>
{

}
