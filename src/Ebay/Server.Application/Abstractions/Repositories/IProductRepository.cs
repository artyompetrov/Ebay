using Server.Domain;

namespace Server.Application.Abstractions.Repositories;

public interface IProductRepository : IRepository<Product, Guid>
{

}