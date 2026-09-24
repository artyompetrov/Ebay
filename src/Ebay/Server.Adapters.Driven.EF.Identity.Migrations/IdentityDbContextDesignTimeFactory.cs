using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Server.Adapters.Driven.EF.Identity.Migrations;

/// <summary>
/// Builds <see cref="IdentityDbContext"/> through the exact same AddDefaultIdentity/AddApiAuthorization
/// registration path Server/Program.cs uses at runtime - not just a bare DbContextOptionsBuilder - so the
/// model scaffolded into migrations here always matches the real runtime model.
/// </summary>
public sealed class IdentityDbContextDesignTimeFactory : IDesignTimeDbContextFactory<IdentityDbContext>
{
    public IdentityDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection")
                               ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is required for design-time migrations.");

        var services = new ServiceCollection();
        services.AddDbContext<IdentityDbContext>(o =>
            o.UseNpgsql(connectionString, b => b.MigrationsAssembly("Server.Adapters.Driven.EF.Identity.Migrations")));
        services.AddDefaultIdentity<ApplicationUser>(o => o.SignIn.RequireConfirmedAccount = true)
            .AddEntityFrameworkStores<IdentityDbContext>();
        services.AddIdentityServer()
            .AddApiAuthorization<ApplicationUser, IdentityDbContext>();

        return services.BuildServiceProvider().GetRequiredService<IdentityDbContext>();
    }
}
