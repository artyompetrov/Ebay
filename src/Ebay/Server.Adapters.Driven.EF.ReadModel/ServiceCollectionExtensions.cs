using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.Adapters.Driven.EF.ReadModel.Queries;
using Server.Adapters.Driven.PostgreSql;
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
    public static void AddEfReadModelAdapter(this IServiceCollection services)
    {
        services.AddPostgreSqlOptions();

        // Pooled factory: ReadDbContext has no constructor dependencies beyond DbContextOptions.
        services.AddPooledDbContextFactory<ReadDbContext>((sp, o) =>
        {
            o.UseNpgsql(sp.GetRequiredService<IOptions<PostgreSqlOptions>>().Value.DefaultConnection);
            // Set through options, not in the constructor: a pooled context resets its change tracker to the
            // options' defaults when it is returned to the pool.
            o.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            o.AddInterceptors(sp.GetServices<IInterceptor>());
        });
        services.AddSingleton<IProductQueries, ProductQueries>();
        services.AddSingleton<IPassportQueries, PassportQueries>();
        services.AddSingleton<IMeasurementQueries, MeasurementQueries>();
        services.AddSingleton<IMeasurementInfoQueries, MeasurementQueries>();
        services.AddSingleton<IMeasurementPhotoQueries, MeasurementPhotoQueries>();
        services.AddSingleton<ITubeWorkingPointQueries, TubeWorkingPointQueries>();
        services.AddSingleton<ILotForSaleQueries, LotForSaleQueries>();
        services.AddSingleton<ILotQueries, LotQueries>();
        services.AddSingleton<ICurrencyQueries, CurrencyQueries>();
        services.AddSingleton<IProductEmailSendHistoryQueries, ProductEmailSendHistoryQueries>();
        services.AddSingleton<IIgnoredLotQueries, IgnoredLotQueries>();
    }
}
