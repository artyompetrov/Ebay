namespace Server.Application.New.Abstractions.Queries

open System
open System.Collections.Generic
open System.Threading
open System.Threading.Tasks
open Server.Application.New.Models

/// <summary>
/// Порт чтения данных товаров.
/// </summary>
type IProductQueries =
    /// <summary>
    /// Возвращает карточку товара.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Карточка товара либо <see langword="null" />, если товар не найден.</returns>
    abstract GetProductAsync: productId: Guid * cancellationToken: CancellationToken -> Task<ProductInfo>

    //todo сделать асинхронную энумерацию или пагинацию
    /// <summary>
    /// Возвращает список всех товаров.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Список товаров.</returns>
    abstract GetAllProductsAsync: cancellationToken: CancellationToken -> Task<IReadOnlyList<ProductInfo>>

    /// <summary>
    /// Возвращает идентификаторы всех товаров.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Список идентификаторов товаров.</returns>
    abstract GetAllProductsIdsAsync: cancellationToken: CancellationToken -> Task<IReadOnlyList<Guid>>
