using Server.Application.Abstractions.Driven.Abstractions.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;
using Server.Domain.LotForSale;

namespace Server.Application.New;

/// <summary>
/// Сервис сценариев чтения агрегатов лотов для продажи.
/// </summary>
public sealed class LotForSaleService
{
    private readonly ILotForSaleQueries _lotForSaleQueries;
    private readonly ILotForSaleRepository _lotForSaleRepository;

    /// <summary>
    /// Создает сервис сценариев чтения лотов для продажи.
    /// </summary>
    /// <param name="lotForSaleQueries">Запросы для чтения лотов для продажи.</param>
    /// <param name="lotForSaleRepository">Репозиторий агрегата лота для продажи.</param>
    public LotForSaleService(ILotForSaleQueries lotForSaleQueries, ILotForSaleRepository lotForSaleRepository)
    {
        _lotForSaleQueries = lotForSaleQueries;
        _lotForSaleRepository = lotForSaleRepository;
    }

    /// <summary>
    /// Возвращает список лотов для продажи.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Коллекция лотов для продажи.</returns>
    public async Task<IReadOnlyCollection<LotForSaleInfo>> GetLotForSalesAsync(CancellationToken cancellationToken)
    {
        return await _lotForSaleQueries.GetLotForSalesAsync(cancellationToken);
    }

    /// <summary>
    /// Создает новый агрегат лота для продажи.
    /// </summary>
    /// <param name="id">Идентификатор лота.</param>
    /// <param name="name">Название лота.</param>
    /// <param name="productId">Идентификатор связанного продукта.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    public async Task CreateLotForSaleAsync(string id, string name, Guid productId, CancellationToken cancellationToken)
    {
        var existingLot = await _lotForSaleRepository.GetByIdAsync(id, cancellationToken);

        if (existingLot is not null)
        {
            throw new InvalidOperationException($"Lot for sale with id {id} already exists.");
        }

        var aggregate = LotForSale.Create(id, name, productId);
        await _lotForSaleRepository.AddAsync(aggregate, cancellationToken);
    }
}
