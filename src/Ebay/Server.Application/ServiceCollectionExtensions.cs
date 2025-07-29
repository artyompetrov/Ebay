using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Consumers;
using Server.Application.Controllers;
using Server.Application.Data;
using Server.Application.Data.Models;
using Server.Application.HostedServices.ChipFind;
using Server.Application.HostedServices.Currencies;
using Server.Application.Services;
using Server.Application.Services.LotDataExtractor;
using Server.Application.Services.MeasuementPlot;
using Server.Application.Services.Measurement;
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
        services.AddScoped<MeasurementService>();
        services.AddScoped<MeasurementPlotService>();

        services.AddScoped<IEbayController, EbayControllerImplementation>();
        services.AddDefaultIdentity<ApplicationUser>(o => o.SignIn.RequireConfirmedAccount = true)
            .AddEntityFrameworkStores<ApplicationDbContext>();

        services.AddHostedService<CurrencyRateBackgroundTask>();
        services.AddHostedService<ChipfindBackgroundTask>();

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
        services.AddDatabaseDeveloperPageExceptionFilter();

        services.AddControllersWithViews(option => { option.Filters.Add<ErrorFilter>(); })
            .AddApplicationPart(appAssembly)
            .AddNewtonsoftJson();

        services.AddRazorPages()
            .AddApplicationPart(typeof(ServiceCollectionExtensions).Assembly);
    }

    public static void InitializeApplication(this IServiceProvider serviceProvider)
    {
        // Migrate DB
        using (var scope = serviceProvider.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            dbContext.Database.Migrate();
        }
    }

}