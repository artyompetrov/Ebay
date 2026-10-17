using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Server.Adapters.Driven.PostgreSql;

namespace Server.Adapters.Driven.EF.WriteModel.Migrations;

public sealed class WriteModelDbContextDesignTimeFactory : IDesignTimeDbContextFactory<WriteModelDbContext>
{
    public WriteModelDbContext CreateDbContext(string[] args)
    {
        // Development: the same appsettings files and environment variables as a local run of the server.
        var builder = Host.CreateApplicationBuilder(new HostApplicationBuilderSettings
        {
            Args = args,
            EnvironmentName = Environments.Development,
            ContentRootPath = Directory.GetCurrentDirectory()
        });
        builder.Services.AddPostgreSqlOptions();
        using var serviceProvider = builder.Services.BuildServiceProvider();
        var connectionString = serviceProvider.GetRequiredService<IOptions<PostgreSqlOptions>>().Value.DefaultConnection;

        var optionsBuilder = new DbContextOptionsBuilder<WriteModelDbContext>();
        optionsBuilder.UseNpgsql(connectionString, b =>
            b.MigrationsAssembly("Server.Adapters.Driven.EF.WriteModel.Migrations"));

        return new WriteModelDbContext(optionsBuilder.Options);
    }
}
