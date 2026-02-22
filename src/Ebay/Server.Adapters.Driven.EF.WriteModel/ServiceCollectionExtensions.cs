using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Driven.EF.WriteModel.Repositories;
using Server.Application.Abstractions.Driven.Abstractions.Abstractions.Repositories;

namespace Server.Adapters.Driven.EF.WriteModel;

public static class ServiceCollectionExtensions
{

    public static void UseEfWriteModelAdapter(
        this IServiceProvider serviceProvider,
        bool ensureCreatedInsteadOfMigrate)
    {
        using var serviceScope = serviceProvider.CreateScope();

        var writeModelDbContext = serviceScope.ServiceProvider.GetRequiredService<WriteModelDbContext>();

        if (ensureCreatedInsteadOfMigrate)
        {
            writeModelDbContext.Database.EnsureCreated();
        }
        else
        {
            writeModelDbContext.Database.Migrate();
        }
    }

    public static void AddEfWriteModelAdapter(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        _ = services.AddDbContext<WriteModelDbContext>((sp, o) =>
        {
            var connectionString = sp.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection")
                                   ?? throw new InvalidOperationException("Connection string cannot be null");
            o.UseNpgsql(connectionString, b =>
                b.MigrationsAssembly("Server.Adapters.Driven.EF.WriteModel.Migrations"));
        });

        _ = services.AddScoped<IMeasurementRepository, MeasurementRepository>();
        _ = services.AddScoped<IMatchedPairDifferenceRepository, MatchedPairDifferenceRepository>();
        _ = services.AddScoped<ITubeWorkingPointsRepository, TubeWorkingPointsRepository>();
        _ = services.AddScoped<IProductRepository, ProductRepository>();
        _ = services.AddScoped<ILotForSaleRepository, LotForSaleRepository>();
    }
}
