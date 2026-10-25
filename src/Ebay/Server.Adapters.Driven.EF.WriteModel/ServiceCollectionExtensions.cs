using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.Adapters.Driven.EF.WriteModel.Repositories;
using Server.Adapters.Driven.PostgreSql;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;

namespace Server.Adapters.Driven.EF.WriteModel;

public static class ServiceCollectionExtensions
{

    public static void UseEfWriteModelAdapter(this IServiceProvider serviceProvider)
    {
        using var writeModelDbContext = serviceProvider
            .GetRequiredService<IDbContextFactory<WriteModelDbContext>>()
            .CreateDbContext();

        writeModelDbContext.Database.Migrate();
    }

    public static void AddEfWriteModelAdapter(
        this IServiceCollection services)
    {
        services.AddPostgreSqlOptions();

        // Pooled factory: WriteModelDbContext has no constructor dependencies beyond DbContextOptions. The factory
        // also registers the context itself as scoped; only WriteModelUnitOfWork resolves it (inside its own
        // scope), because the MassTransit EF bus outbox needs the scoped context instance.
        services.AddPooledDbContextFactory<WriteModelDbContext>((sp, o) =>
        {
            var connectionString = sp.GetRequiredService<IOptions<PostgreSqlOptions>>().Value.DefaultConnection;
            o.UsePostgreSql(connectionString, b =>
                b.MigrationsAssembly("Server.Adapters.Driven.EF.WriteModel.Migrations"));
            o.AddInterceptors(sp.GetServices<IInterceptor>());
        });

        services.AddSingleton(sp =>
        {
            var connectionString = sp.GetRequiredService<IOptions<PostgreSqlOptions>>().Value.DefaultConnection;
            return new DatabaseConcurrentAccessSemaphore(
                maxConcurrent: new Npgsql.NpgsqlConnectionStringBuilder(connectionString).MaxPoolSize / 2);
        });
        services.AddOptions<DbCacheOptions>()
            .BindConfiguration(DbCacheOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();
        services.AddSingleton<ICacheStore, DbCache>();
        services.AddSingleton<IWriteModelUnitOfWorkFactory, WriteModelUnitOfWorkFactory>();

        services.AddSingleton<IMeasurementRepository, MeasurementRepository>();
        services.AddSingleton<IMatchedPairDifferenceRepository, MatchedPairDifferenceRepository>();
        services.AddSingleton<ITubeWorkingPointsRepository, TubeWorkingPointsRepository>();
        services.AddSingleton<IProductRepository, ProductRepository>();
        services.AddSingleton<ILotForSaleRepository, LotForSaleRepository>();
        services.AddSingleton<ILotRepository, LotRepository>();
        services.AddSingleton<ICurrencyRepository, CurrencyRepository>();
        services.AddSingleton<IProductEmailSendHistoryRepository, ProductEmailSendHistoryRepository>();
        services.AddSingleton<IProductPassportRepository, ProductPassportRepository>();
        services.AddSingleton<IIgnoredLotRepository, IgnoredLotRepository>();
        services.AddSingleton<IMeasurementPhotoRepository, MeasurementPhotoRepository>();
    }
}
