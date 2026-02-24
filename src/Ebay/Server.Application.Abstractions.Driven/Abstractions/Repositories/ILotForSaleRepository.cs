using Server.Domain.LotForSale;

namespace Server.Application.Abstractions.Driven.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата лота для продажи.
/// </summary>
public interface ILotForSaleRepository : IRepository<LotForSale, string>
{
}