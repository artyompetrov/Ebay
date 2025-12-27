using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.EF.ReadModel.Queries;
using Server.Application.Abstractions.Queries;

namespace Server.Adapters.EF.ReadModel;

/// <summary>
/// Регистрация в контейнере
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Зарегистрировать EF ReadModel адаптер в контейнере
    /// </summary>
    /// <param name="services">Сервисы</param>
    /// <param name="connectionString">Строка подключения</param>
    public static void AddEfReadModelAdapter(
        this IServiceCollection services, string connectionString)
    {
        _ = services.AddDbContext<ReadDbContext>(o => o.UseNpgsql(connectionString));
        _ = services.AddScoped<IProductQueries, ProductQueries>();
        _ = services.AddScoped<IMeasurementQueries, MeasurementQueries>();
        _ = services.AddScoped<ITubeWorkingPointQueries, TubeWorkingPointQueries>();
    }
}