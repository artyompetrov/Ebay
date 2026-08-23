using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Application.Controllers;
using Server.Application.Data;
using Server.Application.HostedServices.ChipFind;
using Server.Application.HostedServices.Currencies;
using Server.Application.HostedServices.DbCache;
using Server.Application.HostedServices.Measurements;
using Server.Application.HostedServices.SaleAdvertisements;
using Server.Application.Infrastructure;
using Server.Application.New;
using Server.Application.Services;
using Server.Application.Services.GeoIp;
using Server.Application.Services.LotDataExtractor;
using Server.Application.Services.Measurement;
using Server.Application.Services.MeasurementPlot;
using Server.Application.Services.MeasurementWatching;
using Server.Controllers.Generated;

namespace Server.Application;

public static class ServiceCollectionExtensions
{

    /// <summary>
    /// Legacy registration from Server.Application. This assembly is being split into multiple projects; do not expand it with new code. Place new application composition in Server.Application.New and DB infrastructure in DB adapters.
    /// </summary>
    public static void AddApplicationServices(
        this IServiceCollection services)
    {
        var appAssembly = typeof(ServiceCollectionExtensions).Assembly;

        services.AddOptions<EbayServerOptions>()
            .BindConfiguration("EbayServer")
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton(sp => sp.GetRequiredService<IOptions<EbayServerOptions>>().Value);

        services.AddDbContext<ApplicationDbContext>((sp, o) =>
        {
            var connectionString = sp.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection")
                                   ?? throw new InvalidOperationException("Connection string cannot be null");
            o.UseNpgsql(connectionString);
        });
        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());
        services.AddTransient<ShippingRatesService>();
        services.AddSingleton(sp =>
        {
            var connectionString = sp.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection")
                                   ?? throw new InvalidOperationException("Connection string cannot be null");
            return new DatabaseConcurrentAccessSemaphore(
                maxConcurrent: new Npgsql.NpgsqlConnectionStringBuilder(connectionString).MaxPoolSize / 2);
        });
        services.AddTransient<DbCache>();
        services.AddApplicationNewServices();
        services.AddTransient<MatchedMeasurementService>();
        services.AddTransient<MeasurementPlotService>();
        services.AddTransient<IMeasurementWatchedOnEbayHandler, MeasurementWatchedOnEbayHandler>();
        services.AddTransient<TubeWorkingPointService>();
        services.AddHttpClient<GeoIpService>(c =>
        {
            c.Timeout = TimeSpan.FromSeconds(2);
        });

        services.AddTransient<IEbayController, EbayControllerImplementation>();
        services.AddDefaultIdentity<ApplicationUser>(o => o.SignIn.RequireConfirmedAccount = true)
            .AddEntityFrameworkStores<ApplicationDbContext>();

        services.AddHostedService<CurrencyRateBackgroundTask>();
        services.AddHostedService<ChipfindBackgroundTask>();
        services.AddHostedService<SaleAdvertisementCleanupBackgroundTask>();

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

    public static void UseApplication(this IServiceProvider serviceProvider)
    {
        // Migrate DB
        using var serviceScope = serviceProvider.CreateScope();

        var dbContext = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        dbContext.Database.Migrate();
    }
}