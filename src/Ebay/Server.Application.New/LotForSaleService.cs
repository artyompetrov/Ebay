using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.New.LotForSale;
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
    private readonly ILotForSaleIdGenerator _lotForSaleIdGenerator;

    /// <summary>
    /// Создает сервис сценариев чтения лотов для продажи.
    /// </summary>
    /// <param name="lotForSaleQueries">Запросы для чтения лотов для продажи.</param>
    /// <param name="lotForSaleRepository">Репозиторий агрегата лота для продажи.</param>
    /// <param name="writeModelUnitOfWork">Unit of Work для сохранения изменений write-model.</param>
    /// <param name="measurementQueries">Запросы для чтения замеров.</param>
    /// <param name="lotForSaleIdGenerator">Генератор идентификаторов лота для продажи.</param>
    public LotForSaleService(
        ILotForSaleQueries lotForSaleQueries,
        ILotForSaleRepository lotForSaleRepository,
        IWriteModelUnitOfWork writeModelUnitOfWork,
        IMeasurementQueries measurementQueries,
        ILotForSaleIdGenerator lotForSaleIdGenerator)
    {
        _lotForSaleQueries = lotForSaleQueries;
        _lotForSaleRepository = lotForSaleRepository;
        _writeModelUnitOfWork = writeModelUnitOfWork;
        _measurementQueries = measurementQueries;
        _lotForSaleIdGenerator = lotForSaleIdGenerator;
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
        var lotId = _lotForSaleIdGenerator.GenerateNextId();
        var aggregate = Domain.LotForSale.LotForSale.Create(lotId, name, productId, productState);
        await _lotForSaleRepository.AddAsync(aggregate, cancellationToken);
        await _writeModelUnitOfWork.SaveChangesAsync(cancellationToken);
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

        // todo тут надо наверное переделать на генерацию события и потом удаление 
        await lotForSale.EnsureCanBeDeletedAsync(async (productId, linkedLotId, productState, ct) =>
            {
                var linkedMeasurements = await _measurementQueries.GetMeasurementInfosWithSimilarMeasurements(
                    productId,
                    linkedLotId,
                    [productState],
                    Enum.GetValues<MeasurementState>(),
                    ct);

                return linkedMeasurements.Count > 0;
            },
            cancellationToken);

        await _lotForSaleRepository.RemoveAsync(lotForSale.Id, cancellationToken);
        await _writeModelUnitOfWork.SaveChangesAsync(cancellationToken);
    }
}
