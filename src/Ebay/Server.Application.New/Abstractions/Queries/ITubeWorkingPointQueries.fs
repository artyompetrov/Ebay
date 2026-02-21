namespace Server.Application.New.Abstractions.Queries

open System
open System.Threading
open System.Threading.Tasks
open Server.Application.New.Models

/// <summary>
/// Порт чтения рабочей точки лампы для товара.
/// </summary>
type ITubeWorkingPointQueries =
    /// <summary>
    /// Возвращает параметры рабочей точки лампы для товара.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Информация о рабочей точке либо <see langword="null" />, если она не задана.</returns>
    abstract GetWorkingPointInfo:
        productId: Guid *
        cancellationToken: CancellationToken
            -> Task<TubeWorkingPointInfo>
