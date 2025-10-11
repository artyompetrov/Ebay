using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Sever.Adapters.EF.ReadModel.ReadModelSchema;

namespace Sever.Adapters.EF.ReadModel;

internal sealed class ReadDbContext : DbContext
{
    public ReadDbContext(
        DbContextOptions options
    ) : base(options: options)
    {
        ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }



    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<ProductMeasurementDto>(eb =>
        {
            eb.ToTable("ProductMeasurements");
        });
        
    }
    
    public DbSet<ProductMeasurementDto> ProductMeasurements { get; set; } = null!;
}