using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.New.Abstractions.Queries;
using Sever.Adapters.EF.ReadModel.Queries;

namespace Sever.Adapters.EF.ReadModel;

/// <summary>
/// Регистрация в контейнере
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Зарегистрировать EF ReadModel адаптер в контейнере
    /// </summary>
    /// <param name="services">Сервисы</param>
    /// <param name="configuration">Конфигурация приложения</param>
    public static void AddEfReadModelAdapter(
        this IServiceCollection services, IConfiguration configuration)
    {
        _ = services.AddDbContext<ReadDbContext>((sp, o) =>
        {
            var connectionString = sp.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection")
                                   ?? throw new InvalidOperationException("Connection string cannot be null");
            o.UseNpgsql(connectionString);
        });
        _ = services.AddScoped<IProductQueries, ProductQueries>();
        _ = services.AddScoped<IPassportQueries, PassportQueries>();
        _ = services.AddScoped<IMeasurementQueries, MeasurementQueries>();
        _ = services.AddScoped<ITubeWorkingPointQueries, TubeWorkingPointQueries>();
    }
}