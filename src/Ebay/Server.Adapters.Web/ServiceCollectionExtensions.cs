using Server.Controllers.Generated;
using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Web.Controllers;

namespace Server.Adapters.Web;

public static class ServiceCollectionExtensions
{
    public static void AddApplicationServices(
        this IServiceCollection services)
    {
        _ = services.AddScoped<IEbayController, EbayControllerImplementation>();
        
        _ = services.AddDefaultIdentity<ApplicationUser>(o => o.SignIn.RequireConfirmedAccount = true)
            .AddEntityFrameworkStores<ApplicationDbContext>();
        
        _ = services.AddDatabaseDeveloperPageExceptionFilter();
        
        _ = services.AddControllersWithViews(options =>
            {
                _ = options.Filters.Add<ErrorFilter>();
            })
            .AddApplicationPart(typeof(ServiceCollectionExtensions).Assembly)
            .AddNewtonsoftJson();

        _ = services.AddRazorPages()
            .AddApplicationPart(typeof(ServiceCollectionExtensions).Assembly);
    }
}