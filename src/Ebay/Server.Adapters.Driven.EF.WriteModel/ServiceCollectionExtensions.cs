using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Driven.EF.WriteModel.Repositories;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;

namespace Server.Adapters.Driven.EF.WriteModel;

public static class ServiceCollectionExtensions
{

    public static void UseEfWriteModelAdapter(this IServiceProvider serviceProvider)
    {
        using var serviceScope = serviceProvider.CreateScope();

        var writeModelDbContext = serviceScope.ServiceProvider.GetRequiredService<WriteModelDbContext>();

        writeModelDbContext.Database.Migrate();
    }

    public static void AddEfWriteModelAdapter(
        this IServiceCollection services)
    {
        services.AddDbContext<WriteModelDbContext>((sp, o) =>
        {
            var connectionString = sp.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection")
                                   ?? throw new InvalidOperationException("Connection string cannot be null");
            o.UseNpgsql(connectionString, b =>
                b.MigrationsAssembly("Server.Adapters.Driven.EF.WriteModel.Migrations"));
        });

        services.AddScoped<IMeasurementRepository, MeasurementRepository>();
        services.AddScoped<IMatchedPairDifferenceRepository, MatchedPairDifferenceRepository>();
        services.AddScoped<ITubeWorkingPointsRepository, TubeWorkingPointsRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ILotForSaleRepository, LotForSaleRepository>();
        services.AddScoped<IWriteModelUnitOfWork>(sp => sp.GetRequiredService<WriteModelDbContext>());
    }
}