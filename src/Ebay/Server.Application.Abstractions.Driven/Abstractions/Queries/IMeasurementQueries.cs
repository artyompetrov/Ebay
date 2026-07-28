using Server.Application.Abstractions.Driven.Models;
using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Driven.Abstractions.Queries;

/// <summary>
/// Порт чтения данных замеров для бизнес-сценариев и UI.
/// </summary>
public interface IMeasurementQueries
{
    /// <summary>
    /// Возвращает карточки замеров товара по выбранным состояниям замера.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="measurementStates">Фильтр по состояниям замеров.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Коллекция карточек замеров.</returns>
    Task<IReadOnlyCollection<MeasurementInfo>> GetMeasurementsInfo(
        Guid productId,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);

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
    Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimilarMeasurements(
        Guid productId,
        string? lotId,
        IReadOnlyCollection<ProductState> productStates,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает замеры товара с подобранными похожими замерами без фильтра по лоту.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="productStates">Фильтр по состояниям товара.</param>
    /// <param name="measurementStates">Фильтр по состояниям замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Коллекция замеров с похожими измерениями.</returns>
    Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimilarMeasurements(
        Guid productId,
        IReadOnlyCollection<ProductState> productStates,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает карточку замера вместе с бинарными данными файла измерения.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Карточка замера с данными файла либо <see langword="null" />, если замер не найден.</returns>
    Task<MeasurementInfoWithData?> GetMeasurementInfoWithData(string measurementId, CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает карточку замера без бинарных данных.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Карточка замера либо <see langword="null" />, если замер не найден.</returns>
    Task<MeasurementInfo?> GetMeasurementInfo(string measurementId, CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает набор замеров с бинарными данными по списку идентификаторов.
    /// </summary>
    /// <param name="ids">Идентификаторы замеров.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Список найденных замеров с данными.</returns>
    Task<IReadOnlyList<MeasurementInfoWithData>> GetMeasurementInfosWithData(
        IReadOnlyList<string> ids,
        CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает RMSE между секциями двойного триода для указанного замера.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Значение RMSE либо <see langword="null" />, если данные отсутствуют.</returns>
    Task<double?> GetDoubleTriodeSectionRmse(string measurementId, CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает идентификаторы замеров, входящих в ту же пару, что и исходный замер.
    /// </summary>
    /// <param name="id">Идентификатор исходного замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Список идентификаторов замеров пары без исходного замера.</returns>
    Task<IReadOnlyList<string>> GetMeasurementPairMeasurements(
        string id,
        CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает множество уникальных идентификаторов лотов товара.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Множество идентификаторов лотов; может содержать <see langword="null" />.</returns>
    Task<IReadOnlySet<string?>> GetLotIds(
        Guid productId,
        CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает идентификаторы всех замеров.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Список идентификаторов замеров.</returns>
    Task<IReadOnlyList<string>> GetAllMeasurementIds(CancellationToken cancellationToken);
}