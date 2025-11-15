using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Repositories
{
    public interface IMeasurementRepository : IRepository<ProductMeasurement, string>
    {

    }
}