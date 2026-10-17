using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Server.Adapters.Driven.PostgreSql;

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
        // Development: the same appsettings files and environment variables as a local run of the server.
        var builder = Host.CreateApplicationBuilder(new HostApplicationBuilderSettings
        {
            Args = args,
            EnvironmentName = Environments.Development,
            ContentRootPath = Directory.GetCurrentDirectory()
        });

        var services = builder.Services;
        services.AddPostgreSqlOptions();
        services.AddDbContextFactory<IdentityDbContext>(static (sp, o) =>
            o.UseNpgsql(
                sp.GetRequiredService<IOptions<PostgreSqlOptions>>().Value.DefaultConnection,
                b => b.MigrationsAssembly("Server.Adapters.Driven.EF.Identity.Migrations")));
        services.AddDefaultIdentity<ApplicationUser>(o => o.SignIn.RequireConfirmedAccount = true)
            .AddEntityFrameworkStores<IdentityDbContext>();
        services.AddIdentityServer()
            .AddApiAuthorization<ApplicationUser, IdentityDbContext>();

        return services.BuildServiceProvider().GetRequiredService<IDbContextFactory<IdentityDbContext>>().CreateDbContext();
    }
}
