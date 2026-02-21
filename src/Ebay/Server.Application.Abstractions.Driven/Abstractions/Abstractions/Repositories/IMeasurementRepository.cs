using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Driven.Abstractions.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата замера товара.
/// </summary>
public interface IMeasurementRepository : IRepository<ProductMeasurement, string>
{

}
