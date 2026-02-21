namespace Server.Application.New.Abstractions.Repositories

open System
open Server.Application.New.Abstractions
open Server.Domain

/// <summary>
/// Репозиторий агрегата товара.
/// </summary>
type IProductRepository =
    inherit IRepository<Product, Guid>
