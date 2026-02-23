using Server.Application.Abstractions.Driven.Abstractions.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;
using Server.Domain.LotForSale;
using Server.Domain.Measurements;

namespace Server.Application.New;

/// <summary>
/// Сервис сценариев чтения агрегатов лотов для продажи.
/// </summary>
public sealed class LotForSaleService
{
    private readonly ILotForSaleQueries _lotForSaleQueries;
    private readonly ILotForSaleRepository _lotForSaleRepository;
    private readonly IWriteModelUnitOfWork _writeModelUnitOfWork;
    private readonly IMeasurementQueries _measurementQueries;

    /// <summary>
    /// Создает сервис сценариев чтения лотов для продажи.
    /// </summary>
    /// <param name="lotForSaleQueries">Запросы для чтения лотов для продажи.</param>
    /// <param name="lotForSaleRepository">Репозиторий агрегата лота для продажи.</param>
    /// <param name="writeModelUnitOfWork">Unit of Work для сохранения изменений write-model.</param>
    /// <param name="measurementQueries">Запросы для чтения замеров.</param>
    public LotForSaleService(
        ILotForSaleQueries lotForSaleQueries,
        ILotForSaleRepository lotForSaleRepository,
        IWriteModelUnitOfWork writeModelUnitOfWork,
        IMeasurementQueries measurementQueries)
    {
        _lotForSaleQueries = lotForSaleQueries;
        _lotForSaleRepository = lotForSaleRepository;
        _writeModelUnitOfWork = writeModelUnitOfWork;
        _measurementQueries = measurementQueries;
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
    /// <param name="name">Название лота.</param>
    /// <param name="productId">Идентификатор связанного продукта.</param>
    /// <param name="productState">Состояние товара для лота.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    public async Task CreateLotForSaleAsync(string name, Guid productId, ProductState productState, CancellationToken cancellationToken)
    {
        var aggregate = LotForSale.Create(name, productId, productState);
        await _lotForSaleRepository.AddAsync(aggregate, cancellationToken);
        _ = await _writeModelUnitOfWork.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Удаляет агрегат лота для продажи, если на него нет ссылок в замерах.
    /// </summary>
    /// <param name="lotId">Идентификатор лота.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    public async Task DeleteLotForSaleAsync(string lotId, CancellationToken cancellationToken)
    {
        var lotForSale = await _lotForSaleRepository.GetByIdAsync(lotId, cancellationToken)
            ?? throw new InvalidOperationException("Lot for sale not found.");

        await lotForSale.EnsureCanBeDeletedAsync(async (productId, linkedLotId, productState, ct) =>
            {
                var linkedMeasurements = await _measurementQueries.GetMeasurementInfosWithSimilarMeasurements(
                    productId,
                    linkedLotId,
                    [productState],
                    [MeasurementState.Created, MeasurementState.Selling, MeasurementState.Sold],
                    ct);

                return linkedMeasurements.Count > 0;
            },
            cancellationToken);

        await _lotForSaleRepository.RemoveAsync(lotForSale.Id, cancellationToken);
        _ = await _writeModelUnitOfWork.SaveChangesAsync(cancellationToken);
    }
}
