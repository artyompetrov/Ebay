using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Queries;
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
    /// <param name="connectionString">Строка подключения</param>
    public static void AddEfReadModelAdapter(
        this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<ReadDbContext>(o => o.UseNpgsql(connectionString));
        services.AddScoped<IProductQueries, ProductQueries>();
        services.AddScoped<IPassportQueries, PassportQueries>();
        services.AddScoped<IMeasurementQueries, MeasurementQueries>();
        services.AddScoped<ITubeWorkingPointQueries, TubeWorkingPointQueries>();
    }
}