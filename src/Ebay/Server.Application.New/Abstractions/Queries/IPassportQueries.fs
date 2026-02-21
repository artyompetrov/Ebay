namespace Server.Application.New.Abstractions.Queries

open System
open System.Collections.Generic
open System.Threading
open System.Threading.Tasks
open Server.Application.New.Models

/// <summary>
/// Порт чтения паспортов товара.
/// </summary>
type IPassportQueries =
    /// <summary>
    /// Возвращает список паспортов, привязанных к товару.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Список паспортов товара.</returns>
    abstract GetPassports: productId: Guid * cancellationToken: CancellationToken -> Task<IReadOnlyList<Passport>>
