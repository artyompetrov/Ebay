using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions;
using Server.Application.Consumers.EbayCurvesCacheWarmUp;
using Server.Application.Consumers.MatchedPairs;
using Server.Application.Consumers.MeasurementWatching;
using Server.Application.Consumers.PriceCalculator;
using Server.Application.Controllers;
using Server.Application.Data;
using Server.Application.HostedServices.ChipFind;
using Server.Application.HostedServices.Currencies;
using Server.Application.HostedServices.DbCache;
using Server.Application.HostedServices.Measurements;
using Server.Application.HostedServices.SaleAdvertisements;
using Server.Application.Infrastructure;
using Server.Application.Services;
using Server.Application.Services.GeoIp;
using Server.Application.Services.LotDataExtractor;
using Server.Application.Services.Measurement;
using Server.Application.Services.MeasurementPlot;
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

        _ = services.AddSingleton(options);

        _ = services.AddDbContext<ApplicationDbContext>(o => o.UseNpgsql(connectionString));
        _ = services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());
        _ = services.AddScoped<ShippingRatesService>();
        _ = services.AddSingleton(new DatabaseConcurrentAccessSemaphore(
                maxConcurrent: new Npgsql.NpgsqlConnectionStringBuilder(connectionString).MaxPoolSize / 2));
        _ = services.AddScoped<DbCache>();
        _ = services.AddScoped<MeasurementService>();
        _ = services.AddScoped<MatchedMeasurementService>();
        _ = services.AddScoped<MeasurementPlotService>();
        _ = services.AddScoped<TubeWorkingPointService>();
        _ = services.AddScoped<ProductService>();
        _ = services.AddHttpClient<GeoIpService>(c =>
        {
            c.Timeout = TimeSpan.FromSeconds(2);
        });

        _ = services.AddScoped<IEbayController, EbayControllerImplementation>();
        _ = services.AddDefaultIdentity<ApplicationUser>(o => o.SignIn.RequireConfirmedAccount = true)
            .AddEntityFrameworkStores<ApplicationDbContext>();

        _ = services.AddHostedService<CurrencyRateBackgroundTask>();
        _ = services.AddHostedService<ChipfindBackgroundTask>();
        _ = services.AddHostedService<SaleAdvertisementCleanupBackgroundTask>();

        _ = services.AddOptions<SqlTransportOptions>()
            .Configure(o => { o.ConnectionString = connectionString; });

        _ = services.AddPostgresMigrationHostedService(x =>
        {
            x.CreateDatabase = false;
            x.CreateInfrastructure = true;
        });
        _ = services.AddMassTransit(x =>
        {
            _ = x.AddConsumer<CalculatePricesForAllConsumer>();
            _ = x.AddConsumer<CalculatePricesForProductConsumer>();
            _ = x.AddConsumer<CalculatePricesForLotConsumer>();
            _ = x.AddConsumer<MeasurementWatchedOnEbayConsumer>();
            _ = x.AddConsumer<CalculateEbayCurvesForMeasurementConsumer>(c =>
            {
                c.UseConcurrencyLimit(10);
            });
            _ = x.AddConsumer<MatchedPairsCalculator>(c =>
            {
                c.UseConcurrencyLimit(1);
            });
            _ = x.AddConsumer<CalculateTotalAveragePriceForProductConsumer>(c => c.Options<BatchOptions>(o =>
            {
                o.ConcurrencyLimit = 1;
                o.MessageLimit = 100;
            }));
            x.AddEntityFrameworkOutbox<ApplicationDbContext>(o =>
            {
                _ = o.UsePostgres();
                o.UseBusOutbox();
            });

            x.AddSqlMessageScheduler();

            x.UsingPostgres((context, cfg) =>
            {
                cfg.UseSqlMessageScheduler();

                cfg.ConfigureEndpoints(context);
            });

        });
        _ = services.AddHostedService<DbCacheCleanupHostedService>();
        _ = services.AddHostedService<MeasurementPlotWarmupHostedService>();
        _ = services.AddDatabaseDeveloperPageExceptionFilter();

        _ = services.AddControllersWithViews(options =>
            {
                _ = options.Filters.Add<ErrorFilter>();
            })
            .AddApplicationPart(appAssembly)
            .AddNewtonsoftJson();

        _ = services.AddRazorPages()
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