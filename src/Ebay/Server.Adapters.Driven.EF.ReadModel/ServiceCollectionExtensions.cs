using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Driven.EF.ReadModel.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Queries;

namespace Server.Adapters.Driven.EF.ReadModel;

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
    public static void AddEfReadModelAdapter(this IServiceCollection services)
    {
        services.AddDbContext<ReadDbContext>((sp, o) =>
        {
            var connectionString = sp.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection")
                                   ?? throw new InvalidOperationException("Connection string cannot be null");
            o.UseNpgsql(connectionString);
        });
        services.AddScoped<IProductQueries, ProductQueries>();
        services.AddScoped<IPassportQueries, PassportQueries>();
        services.AddScoped<IMeasurementQueries, MeasurementQueries>();
        services.AddScoped<ITubeWorkingPointQueries, TubeWorkingPointQueries>();
        services.AddScoped<ILotForSaleQueries, LotForSaleQueries>();
    }
}