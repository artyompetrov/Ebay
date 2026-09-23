using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Application.Controllers;
using Server.Application.Data;
using Server.Application.New;
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

        services.AddOptions<ImageCacheOptions>()
            .BindConfiguration(ImageCacheOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddDbContext<ApplicationDbContext>((sp, o) =>
        {
            var connectionString = sp.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection")
                                   ?? throw new InvalidOperationException("Connection string cannot be null");
            o.UseNpgsql(connectionString);
            o.AddInterceptors(sp.GetServices<IInterceptor>());
        });
        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());
        services.AddApplicationNewServices();

        services.AddTransient<IEbayController, EbayControllerImplementation>();
        services.AddDefaultIdentity<ApplicationUser>(o => o.SignIn.RequireConfirmedAccount = true)
            .AddEntityFrameworkStores<ApplicationDbContext>();

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
