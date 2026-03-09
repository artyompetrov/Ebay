using Server.Application.Abstractions.Driven.Models;
using Server.Domain;
using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Driven.Abstractions.Queries;

/// <summary>
/// Порт чтения данных товаров.
/// </summary>
public interface IProductQueries
{
    /// <summary>
    /// Возвращает карточку товара.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Карточка товара либо <see langword="null" />, если товар не найден.</returns>
    Task<ProductInfo?> GetProductAsync(Guid productId, CancellationToken cancellationToken);

    //todo сделать асинхронную энумерацию или пагинацию
    /// <summary>
    /// Возвращает список всех товаров.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Список товаров.</returns>
    Task<IReadOnlyList<ProductInfo>> GetAllProductsAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает идентификаторы всех товаров.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Список идентификаторов товаров.</returns>
    Task<IReadOnlyList<Guid>> GetAllProductsIdsAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает результаты расчета лотов для товара.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Список результатов расчета лотов.</returns>
    Task<IReadOnlyList<LotCalculationResult>> GetLotCalculationResultsAsync(Guid productId, CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает количество невыставленных на eBay замеров товара по состоянию замера.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="measurementState">Состояние замера.</param>
    /// <param name="publishedThreshold">Порог публикации на eBay.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Количество невыставленных на eBay замеров.</returns>
    Task<int> GetUnpublishedOnEbayCountAsync(
        Guid productId,
        MeasurementState measurementState,
        DateTime publishedThreshold,
        CancellationToken cancellationToken);
}
