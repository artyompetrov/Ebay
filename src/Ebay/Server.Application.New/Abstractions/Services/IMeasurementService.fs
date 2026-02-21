namespace Server.Application.New.Abstractions.Services

open System
open System.Collections.Generic
open System.Threading
open System.Threading.Tasks
open Server.Application.New.Models
open Server.Domain.Measurements

/// <summary>
/// Порт бизнес-сценариев для управления замерами товара.
/// </summary>
type IMeasurementService =
    /// <summary>
    /// Сохраняет новый замер товара.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="measurementsFile">Содержимое файла замера.</param>
    /// <param name="productState">Состояние товара.</param>
    /// <param name="manufactureCode">Код производства.</param>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    abstract SaveMeasurement:
        measurementId: string *
        measurementsFile: byte[] *
        productState: ProductState *
        manufactureCode: string *
        productId: Guid *
        cancellationToken: CancellationToken
            -> Task

    /// <summary>
    /// Обновляет локацию для замера.
    /// </summary>
    /// <param name="location">Новая локация.</param>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    abstract UpdateMeasurementLocation:
        location: string *
        measurementId: string *
        cancellationToken: CancellationToken
            -> Task

    /// <summary>
    /// Обновляет код производства для замера.
    /// </summary>
    /// <param name="manufactureCode">Новый код производства.</param>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    abstract UpdateMeasurementManufactureCode:
        manufactureCode: string *
        measurementId: string *
        cancellationToken: CancellationToken
            -> Task

    /// <summary>
    /// Обновляет идентификатор matched-пары для замера.
    /// </summary>
    /// <param name="matchId">Идентификатор matched-пары.</param>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    abstract UpdateMeasurementMatchId:
        matchId: string *
        measurementId: string *
        cancellationToken: CancellationToken
            -> Task

    /// <summary>
    /// Обновляет идентификатор лота для замера.
    /// </summary>
    /// <param name="lotId">Идентификатор лота.</param>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    abstract UpdateMeasurementLotId:
        lotId: string *
        measurementId: string *
        cancellationToken: CancellationToken
            -> Task

    /// <summary>
    /// Обновляет состояние замера.
    /// </summary>
    /// <param name="state">Новое состояние замера.</param>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    abstract UpdateMeasurementState:
        state: MeasurementState *
        measurementId: string *
        cancellationToken: CancellationToken
            -> Task

    /// <summary>
    /// Удаляет замер и связанные с ним данные.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    abstract DeleteMeasurement:
        measurementId: string *
        cancellationToken: CancellationToken
            -> Task

    /// <summary>
    /// Возвращает замеры товара с похожими измерениями.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="productState">Фильтр по состояниям товара.</param>
    /// <param name="measurementStates">Фильтр по состояниям замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Коллекция замеров с похожими измерениями.</returns>
    abstract GetMeasurementInfos:
        productId: Guid *
        productState: IReadOnlyCollection<ProductState> *
        measurementStates: IReadOnlyCollection<MeasurementState> *
        cancellationToken: CancellationToken
            -> Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>>

    /// <summary>
    /// Возвращает файл замера в prettified zip-формате.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Содержимое zip-файла либо <see langword="null" />, если замер не найден.</returns>
    abstract GetMeasurementFile:
        measurementId: string *
        cancellationToken: CancellationToken
            -> Task<byte[]>

    /// <summary>
    /// Возвращает набор идентификаторов лотов для товара.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Множество идентификаторов лотов; может содержать <see langword="null" />.</returns>
    abstract GetLotIdsForProductAsync:
        productId: Guid *
        cancellationToken: CancellationToken
            -> Task<IReadOnlySet<string>>
