namespace Server.Application.New.Abstractions.Repositories

open Server.Application.New.Abstractions
open Server.Domain.Measurements

/// <summary>
/// Репозиторий агрегата замера товара.
/// </summary>
type IMeasurementRepository =
    inherit IRepository<ProductMeasurement, string>
