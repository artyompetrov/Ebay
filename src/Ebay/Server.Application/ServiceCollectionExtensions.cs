using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Consumers;
using Server.Application.Controllers;
using Server.Application.Data;
using Server.Application.Data.Models;
using Server.Application.HostedServices.ChipFind;
using Server.Application.HostedServices.Currencies;
using Server.Application.HostedServices.DbCache;
using Server.Application.HostedServices.Measurements;
using Server.Application.HostedServices.SaleAdvertisements;
using Server.Application.Infrastructure;
using Server.Application.Services.LotDataExtractor;
using Server.Application.Services.Measurement;
using Server.Application.Services.MeasurementPlot;
using Server.Application.Services.GeoIp;
using Server.Controllers.Generated;

namespace Server.Application;

public static class ServiceCollectionExtensions
{
    public static void AddApplicationServices(
        this IServiceCollection services,
        EbayServerOptions options,
        string connectionString)
    {
        var appAssembly = typeof(ServiceCollectionExtensions).Assembly;

        services.AddSingleton(options);
        services.AddNpgsqlDataSource(connectionString);
        services.AddDbContext<ApplicationDbContext>(o => o.UseNpgsql());
        services.AddSingleton<ShippingRatesService>();
        services.AddSingleton(new DatabaseConcurrentAccessSemaphore(
                maxConcurrent: new Npgsql.NpgsqlConnectionStringBuilder(connectionString).MaxPoolSize / 2));
        services.AddScoped<DbCache>();
        services.AddScoped<MeasurementService>();
        services.AddScoped<MatchedMeasurementService>();
        services.AddScoped<MeasurementPlotService>();
        services.AddHttpClient<GeoIpService>(c =>
        {
            c.Timeout = TimeSpan.FromSeconds(2);
        });

        services.AddScoped<IEbayController, EbayControllerImplementation>();
        services.AddDefaultIdentity<ApplicationUser>(o => o.SignIn.RequireConfirmedAccount = true)
            .AddEntityFrameworkStores<ApplicationDbContext>();

        services.AddHostedService<CurrencyRateBackgroundTask>();
        services.AddHostedService<ChipfindBackgroundTask>();
        services.AddHostedService<SaleAdvertisementCleanupBackgroundTask>();

        services.AddOptions<SqlTransportOptions>()
            .Configure(o => { o.ConnectionString = connectionString; });

        services.AddPostgresMigrationHostedService(x =>
        {
            x.CreateDatabase = false;
            x.CreateInfrastructure = true;
        });
        services.AddMassTransit(x =>
        {
            x.AddConsumer<CalculatePricesForAllConsumer>();
            x.AddConsumer<CalculatePricesForProductConsumer>();
            x.AddConsumer<CalculatePricesForLotConsumer>();
            x.AddConsumer<CalculateEbayCurvesForMeasurementConsumer>(c =>
            {
                c.UseConcurrencyLimit(10);
            });
            x.AddConsumer<CalculateTotalAveragePriceForProductConsumer>(c => c.Options<BatchOptions>(o =>
            {
                o.ConcurrencyLimit = 1;
                o.MessageLimit = 100;
            }));
            x.AddEntityFrameworkOutbox<ApplicationDbContext>(o =>
            {
                o.UsePostgres();
                o.UseBusOutbox();
            });

            x.AddSqlMessageScheduler();

            x.UsingPostgres((context, cfg) =>
            {
                cfg.UseSqlMessageScheduler();

                cfg.ConfigureEndpoints(context);
            });

        });
        services.AddHostedService<DbCacheCleanupHostedService>();
        services.AddHostedService<MeasurementPlotWarmupHostedService>();
        services.AddDatabaseDeveloperPageExceptionFilter();

        services.AddControllersWithViews(options =>
            {
                options.Filters.Add<ErrorFilter>();
            })
            .AddApplicationPart(appAssembly)
            .AddNewtonsoftJson();

        services.AddRazorPages()
            .AddApplicationPart(typeof(ServiceCollectionExtensions).Assembly);
    }

    public static void InitializeApplication(this IServiceProvider serviceProvider)
    {
        // Migrate DB
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dbContext.Database.Migrate();
    }

}