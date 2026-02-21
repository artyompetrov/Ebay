namespace Server.Application.New.Abstractions.Queries

open System
open System.Collections.Generic
open System.Threading
open System.Threading.Tasks
open Server.Application.New.Models
open Server.Domain.Measurements

/// <summary>
/// Порт чтения данных замеров для бизнес-сценариев и UI.
/// </summary>
type IMeasurementQueries =
    /// <summary>
    /// Возвращает карточки замеров товара по выбранным состояниям замера.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="measurementStates">Фильтр по состояниям замеров.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Коллекция карточек замеров.</returns>
    abstract GetMeasurementsInfo:
        productId: Guid *
        measurementStates: IReadOnlyCollection<MeasurementState> *
        cancellationToken: CancellationToken
            -> Task<IReadOnlyCollection<MeasurementInfo>>

    /// <summary>
    /// Возвращает замеры товара с подобранными похожими замерами,
    /// отфильтрованные по идентификатору лота.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="lotId">Идентификатор лота eBay.</param>
    /// <param name="productStates">Фильтр по состояниям товара.</param>
    /// <param name="measurementStates">Фильтр по состояниям замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Коллекция замеров с похожими измерениями.</returns>
    abstract GetMeasurementInfosWithSimilarMeasurements:
        productId: Guid *
        lotId: string *
        productStates: IReadOnlyCollection<ProductState> *
        measurementStates: IReadOnlyCollection<MeasurementState> *
        cancellationToken: CancellationToken
            -> Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>>

    /// <summary>
    /// Возвращает замеры товара с подобранными похожими замерами без фильтра по лоту.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="productStates">Фильтр по состояниям товара.</param>
    /// <param name="measurementStates">Фильтр по состояниям замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Коллекция замеров с похожими измерениями.</returns>
    abstract GetMeasurementInfosWithSimilarMeasurements:
        productId: Guid *
        productStates: IReadOnlyCollection<ProductState> *
        measurementStates: IReadOnlyCollection<MeasurementState> *
        cancellationToken: CancellationToken
            -> Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>>

    /// <summary>
    /// Возвращает карточку замера вместе с бинарными данными файла измерения.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Карточка замера с данными файла либо <see langword="null" />, если замер не найден.</returns>
    abstract GetMeasurementInfoWithData:
        measurementId: string *
        cancellationToken: CancellationToken
            -> Task<MeasurementInfoWithData>

    /// <summary>
    /// Возвращает карточку замера без бинарных данных.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Карточка замера либо <see langword="null" />, если замер не найден.</returns>
    abstract GetMeasurementInfo:
        measurementId: string *
        cancellationToken: CancellationToken
            -> Task<MeasurementInfo>

    /// <summary>
    /// Возвращает набор замеров с бинарными данными по списку идентификаторов.
    /// </summary>
    /// <param name="ids">Идентификаторы замеров.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Список найденных замеров с данными.</returns>
    abstract GetMeasurementInfosWithData:
        ids: IReadOnlyList<string> *
        cancellationToken: CancellationToken
            -> Task<IReadOnlyList<MeasurementInfoWithData>>

    /// <summary>
    /// Возвращает RMSE между секциями двойного триода для указанного замера.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Значение RMSE либо <see langword="null" />, если данные отсутствуют.</returns>
    abstract GetDoubleTriodeSectionRmse:
        measurementId: string *
        cancellationToken: CancellationToken
            -> Task<Nullable<double>>

    /// <summary>
    /// Возвращает идентификаторы замеров, входящих в ту же пару, что и исходный замер.
    /// </summary>
    /// <param name="id">Идентификатор исходного замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Список идентификаторов замеров пары без исходного замера.</returns>
    abstract GetMeasurementPairMeasurements:
        id: string *
        cancellationToken: CancellationToken
            -> Task<IReadOnlyList<string>>

    /// <summary>
    /// Возвращает множество уникальных идентификаторов лотов товара.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Множество идентификаторов лотов; может содержать <see langword="null" />.</returns>
    abstract GetLotIds:
        productId: Guid *
        cancellationToken: CancellationToken
            -> Task<IReadOnlySet<string>>
