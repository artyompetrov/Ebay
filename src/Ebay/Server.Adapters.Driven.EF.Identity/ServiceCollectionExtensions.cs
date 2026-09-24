using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Server.Adapters.Driven.EF.Identity;

public static class ServiceCollectionExtensions
{
    public static void AddEfIdentityAdapter(this IServiceCollection services)
    {
        services.AddDbContext<IdentityDbContext>((sp, o) =>
        {
            var connectionString = sp.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection")
                                   ?? throw new InvalidOperationException("Connection string cannot be null");
            o.UseNpgsql(connectionString, b =>
                b.MigrationsAssembly("Server.Adapters.Driven.EF.Identity.Migrations"));
            o.AddInterceptors(sp.GetServices<IInterceptor>());
        });
    }

    public static void UseEfIdentityAdapter(this IServiceProvider serviceProvider)
    {
        using var serviceScope = serviceProvider.CreateScope();

        var identityDbContext = serviceScope.ServiceProvider.GetRequiredService<IdentityDbContext>();

        identityDbContext.Database.Migrate();
    }
}
