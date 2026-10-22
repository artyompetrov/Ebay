using OneOf;
using OneOf.Types;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.LotForSale;
using Server.Domain.Errors;
using Server.Domain.Measurements;

namespace Server.Application;

/// <summary>
/// Сервис сценариев чтения агрегатов лотов для продажи.
/// </summary>
public sealed class LotForSaleService
{
    private readonly ILotForSaleQueries _lotForSaleQueries;
    private readonly ILotForSaleRepository _lotForSaleRepository;
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;
    private readonly IMeasurementQueries _measurementQueries;
    private readonly ILotForSaleIdGenerator _lotForSaleIdGenerator;

    /// <summary>
    /// Создает сервис сценариев чтения лотов для продажи.
    /// </summary>
    /// <param name="lotForSaleQueries">Запросы для чтения лотов для продажи.</param>
    /// <param name="lotForSaleRepository">Репозиторий агрегата лота для продажи.</param>
    /// <param name="unitOfWorkFactory">Фабрика Unit of Work для операций записи write-model.</param>
    /// <param name="measurementQueries">Запросы для чтения замеров.</param>
    /// <param name="lotForSaleIdGenerator">Генератор идентификаторов лота для продажи.</param>
    public LotForSaleService(
        ILotForSaleQueries lotForSaleQueries,
        ILotForSaleRepository lotForSaleRepository,
        IWriteModelUnitOfWorkFactory unitOfWorkFactory,
        IMeasurementQueries measurementQueries,
        ILotForSaleIdGenerator lotForSaleIdGenerator)
    {
        _lotForSaleQueries = lotForSaleQueries;
        _lotForSaleRepository = lotForSaleRepository;
        _unitOfWorkFactory = unitOfWorkFactory;
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
    /// Возвращает лот для продажи по идентификатору.
    /// </summary>
    /// <param name="lotId">Идентификатор лота.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Лот для продажи либо <see langword="null" />, если не найден.</returns>
    public async Task<LotForSaleInfo?> GetLotForSaleByIdAsync(string lotId, CancellationToken cancellationToken)
    {
        return await _lotForSaleQueries.GetLotForSaleByIdAsync(lotId, cancellationToken);
    }

    /// <summary>
    /// Создает новый агрегат лота для продажи.
    /// </summary>
    /// <param name="name">Название лота.</param>
    /// <param name="productId">Идентификатор связанного продукта.</param>
    /// <param name="productState">Состояние товара для лота.</param>
    /// <param name="measurementState">Статус замера для лота.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns><see cref="DomainError"/>, если параметры лота некорректны.</returns>
    public async Task<OneOf<Success, DomainError>> CreateLotForSaleAsync(string name, Guid productId, ProductState productState, MeasurementState measurementState, CancellationToken cancellationToken)
    {
        var lotId = _lotForSaleIdGenerator.GenerateNextId();
        var created = Domain.LotForSale.LotForSale.Create(lotId, name, productId, productState, measurementState);
        if (created.TryPickT1(out var error, out var aggregate))
        {
            return error;
        }

        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);
        await _lotForSaleRepository.AddAsync(unitOfWork, aggregate, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new Success();
    }

    /// <summary>
    /// Удаляет агрегат лота для продажи, если на него нет ссылок в замерах.
    /// </summary>
    /// <param name="lotId">Идентификатор лота.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns><see cref="NotFound"/>, если лот не найден; <see cref="DomainError"/>, если на лот ссылаются замеры.</returns>
    public async Task<OneOf<Success, NotFound, DomainError>> DeleteLotForSaleAsync(string lotId, CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var lotForSale = await _lotForSaleRepository.GetByIdAsync(unitOfWork, lotId, cancellationToken);
        if (lotForSale is null)
        {
            return new NotFound();
        }

        // todo тут надо наверное переделать на генерацию события и потом удаление 
        var canBeDeleted = await lotForSale.EnsureCanBeDeletedAsync(async (productId, linkedLotId, productState, ct) =>
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

        if (canBeDeleted.TryPickT1(out var error, out _))
        {
            return error;
        }

        await _lotForSaleRepository.RemoveAsync(unitOfWork, lotForSale.Id, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new Success();
    }
}
