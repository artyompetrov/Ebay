using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions;
using Server.Domain.Measurements;

namespace Server.Adapters.EF.WriteModel;

public static class ServiceCollectionExtensions
{
    public static void AddEfWriteModelAdapter(
        this IServiceCollection services)
    {
        services.AddScoped<IRepository<ProductMeasurement, string>, MeasurementRepository>();
    }
}