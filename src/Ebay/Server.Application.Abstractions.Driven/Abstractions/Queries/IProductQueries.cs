using Server.Application.Abstractions.Driven.Models;

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
}
