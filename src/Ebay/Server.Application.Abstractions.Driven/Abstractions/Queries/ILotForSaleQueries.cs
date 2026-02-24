using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driven.Abstractions.Queries;

/// <summary>
/// Запросы для чтения агрегатов лотов для продажи.
/// </summary>
public interface ILotForSaleQueries
{
    /// <summary>
    /// Возвращает список лотов для продажи.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Коллекция лотов для продажи.</returns>
    Task<IReadOnlyCollection<LotForSaleInfo>> GetLotForSalesAsync(CancellationToken cancellationToken);
}