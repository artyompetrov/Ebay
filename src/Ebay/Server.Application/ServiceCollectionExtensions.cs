using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.Application.Abstractions.Driven.Abstractions;
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

        _ = services.AddOptions<EbayServerOptions>()
            .BindConfiguration("EbayServer")
            .ValidateDataAnnotations()
            .ValidateOnStart();

        _ = services.AddSingleton(sp => sp.GetRequiredService<IOptions<EbayServerOptions>>().Value);

        _ = services.AddDbContext<ApplicationDbContext>((sp, o) =>
        {
            var connectionString = sp.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection")
                                   ?? throw new InvalidOperationException("Connection string cannot be null");
            o.UseNpgsql(connectionString);
        });
        _ = services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());
        _ = services.AddScoped<ShippingRatesService>();
        _ = services.AddSingleton(sp =>
        {
            var connectionString = sp.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection")
                                   ?? throw new InvalidOperationException("Connection string cannot be null");
            return new DatabaseConcurrentAccessSemaphore(
                maxConcurrent: new Npgsql.NpgsqlConnectionStringBuilder(connectionString).MaxPoolSize / 2);
        });
        _ = services.AddScoped<DbCache>();
        services.AddApplicationNewServices();
        _ = services.AddScoped<MatchedMeasurementService>();
        _ = services.AddScoped<MeasurementPlotService>();
        _ = services.AddScoped<TubeWorkingPointService>();
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


    public static void UseApplication(this IServiceProvider serviceProvider)
    {
        // Migrate DB
        using var serviceScope = serviceProvider.CreateScope();

        var dbContext = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        dbContext.Database.Migrate();
    }

}