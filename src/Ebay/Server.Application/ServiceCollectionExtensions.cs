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
using Server.Controllers.Generated;

namespace Server.Application;

public static class ServiceCollectionExtensions
{
    public static void AddApplicationServices(this IServiceCollection services, EbayServerOptions options, string connectionString)
    {
        services.AddSingleton(options);
        services.AddNpgsqlDataSource(connectionString);
        services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql());
        services.AddSingleton<ShippingRatesService>();

        services.AddScoped<IEbayController, EbayControllerImplementation>();

        services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
            .AddEntityFrameworkStores<ApplicationDbContext>();

        services.AddHostedService<CurrencyRateBackgroundTask>();
        services.AddHostedService<ChipfindBackgroundTask>();

        services.AddOptions<SqlTransportOptions>()
            .Configure(options =>
            {
                options.ConnectionString = connectionString;
            });

        services.AddPostgresMigrationHostedService(x =>
        {
            x.CreateDatabase = false;
            x.CreateInfrastructure = true;
        });
        services.AddMassTransit(
            x =>
            {
                x.AddConsumer<CalculatePricesForAllConsumer>();
                x.AddConsumer<CalculatePricesForProductConsumer>();
                x.AddConsumer<CalculatePricesForLotConsumer>();
                x.AddConsumer<CalculateTotalAveragePriceForProductConsumer>(
                    c => c.Options<BatchOptions>(o =>
                    {
                        o.ConcurrencyLimit = 1;
                        o.MessageLimit = 100;
                    }));
                x.AddEntityFrameworkOutbox<ApplicationDbContext>(
                    o =>
                    {
                        o.UsePostgres();
                        o.UseBusOutbox();
                    });

                x.AddSqlMessageScheduler();

                x.UsingPostgres(
                    (context, cfg) =>
                    {
                        cfg.UseSqlMessageScheduler();

                        cfg.ConfigureEndpoints(context);
                    });

            });

        services.AddControllersWithViews(option => { option.Filters.Add<ErrorFilter>(); })
            .AddNewtonsoftJson();
        services.AddRazorPages();
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