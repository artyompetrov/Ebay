using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Server.Adapters.Driven.EF.WriteModel;

namespace Server.Adapters.Driven.EF.WriteModel.Migrations;

public sealed class LotForSaleDbContextDesignTimeFactory : IDesignTimeDbContextFactory<LotForSaleDbContext>
{
    public LotForSaleDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<LotForSaleDbContext>();
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
                               ?? "Host=localhost;Port=15432;Database=ebay;Username=ebay;Password=catnip0-spoil4-untrimmed";

        _ = optionsBuilder.UseNpgsql(connectionString, b =>
            b.MigrationsAssembly("Server.Adapters.Driven.EF.WriteModel.Migrations"));

        return new LotForSaleDbContext(optionsBuilder.Options);
    }
}
