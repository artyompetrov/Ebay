using Server.Application.Abstractions.Driving.Models;
using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Driving.Abstractions.Services;

/// <summary>
/// Порт бизнес-сценариев для управления замерами товара.
/// </summary>
public interface IMeasurementService
{
    /// <summary>
    /// Сохраняет новый замер товара.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="measurementsFile">Содержимое файла замера.</param>
    /// <param name="productState">Состояние товара.</param>
    /// <param name="manufactureCode">Код производства.</param>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task SaveMeasurement(
        string measurementId,
        byte[] measurementsFile,
        ProductState productState,
        string manufactureCode,
        Guid productId,
        CancellationToken cancellationToken);

    /// <summary>
    /// Обновляет локацию для замера.
    /// </summary>
    /// <param name="location">Новая локация.</param>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task UpdateMeasurementLocation(
        string location,
        string measurementId,
        CancellationToken cancellationToken);

    /// <summary>
    /// Обновляет код производства для замера.
    /// </summary>
    /// <param name="manufactureCode">Новый код производства.</param>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task UpdateMeasurementManufactureCode(
        string manufactureCode,
        string measurementId,
        CancellationToken cancellationToken);

    /// <summary>
    /// Обновляет идентификатор matched-пары для замера.
    /// </summary>
    /// <param name="matchId">Идентификатор matched-пары.</param>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task UpdateMeasurementMatchId(
        string? matchId,
        string measurementId,
        CancellationToken cancellationToken);

    /// <summary>
    /// Обновляет идентификатор лота для замера.
    /// </summary>
    /// <param name="lotId">Идентификатор лота.</param>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task UpdateMeasurementLotId(
        string? lotId,
        string measurementId,
        CancellationToken cancellationToken);

    /// <summary>
    /// Обновляет состояние замера.
    /// </summary>
    /// <param name="state">Новое состояние замера.</param>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task UpdateMeasurementState(
        MeasurementState state,
        string measurementId,
        CancellationToken cancellationToken);

    /// <summary>
    /// Удаляет замер и связанные с ним данные.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task DeleteMeasurement(
        string measurementId,
        CancellationToken cancellationToken);

    /// <summary>
    /// Отмечает замер как проверенный при инвентаризации, обновляя дату последней проверки.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Дата отметки об инвентаризации либо <see langword="null" />, если замер не найден.</returns>
    Task<DateTimeOffset?> MarkInventoryCheckedAsync(
        string measurementId,
        CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает замеры товара с похожими измерениями.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="productState">Фильтр по состояниям товара.</param>
    /// <param name="measurementStates">Фильтр по состояниям замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Коллекция замеров с похожими измерениями.</returns>
    Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurementsView>> GetMeasurementInfos(
        Guid productId,
        IReadOnlyCollection<ProductState> productState,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает файл замера в prettified zip-формате.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Содержимое zip-файла либо <see langword="null" />, если замер не найден.</returns>
    Task<byte[]?> GetMeasurementFile(
        string measurementId,
        CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает набор идентификаторов лотов для товара.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Множество идентификаторов лотов; может содержать <see langword="null" />.</returns>
    Task<IReadOnlySet<string?>> GetLotIdsForProductAsync(
        Guid productId,
        CancellationToken cancellationToken);
}