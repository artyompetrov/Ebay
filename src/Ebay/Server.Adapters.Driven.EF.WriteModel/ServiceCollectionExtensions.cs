using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Driven.EF.WriteModel.Repositories;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Abstractions.Services;

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
        _ = services.AddScoped<IWriteModelUnitOfWork>(sp => sp.GetRequiredService<WriteModelDbContext>());
        _ = services.AddScoped<ICurrencyRateRepository, CurrencyRateRepository>();
        _ = services.AddScoped<IProductEmailSendHistoryRepository, ProductEmailSendHistoryRepository>();
    }
}