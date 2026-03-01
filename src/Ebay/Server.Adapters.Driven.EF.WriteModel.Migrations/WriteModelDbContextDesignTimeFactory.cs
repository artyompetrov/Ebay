using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Server.Adapters.Driven.EF.WriteModel.Migrations;

public sealed class WriteModelDbContextDesignTimeFactory : IDesignTimeDbContextFactory<WriteModelDbContext>
{
    public WriteModelDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection")
                               ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is required for design-time migrations.");

        var optionsBuilder = new DbContextOptionsBuilder<WriteModelDbContext>();
        optionsBuilder.UseNpgsql(connectionString, b =>
            b.MigrationsAssembly("Server.Adapters.Driven.EF.WriteModel.Migrations"));

        return new WriteModelDbContext(optionsBuilder.Options);
    }
}