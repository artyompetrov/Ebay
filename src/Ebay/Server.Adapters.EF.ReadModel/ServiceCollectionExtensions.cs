using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Measurements;

namespace Sever.Adapters.EF.ReadModel;

public static class ServiceCollectionExtensions
{
    public static void AddEfReadModelAdapter(
        this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<ReadDbContext>(o => o.UseNpgsql(connectionString));
        services.AddScoped<IProductQueries, ProductQueries>();
        services.AddScoped<IPassportQueries, PassportQueries>();
        services.AddScoped<IMeasurementQueries, MeasurementQueries>();
    }
}