using Server.Application.Abstractions.Driven.Abstractions.Abstractions;
using Server.Domain.LotForSale;

namespace Server.Application.Abstractions.Driven.Abstractions.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата лота для продажи.
/// </summary>
public interface ILotForSaleRepository : IRepository<LotForSale, string>
{
}
