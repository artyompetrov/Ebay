using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Sever.Adapters.EF.ReadModel.ReadModelSchema;

namespace Sever.Adapters.EF.ReadModel;

internal sealed class ReadDbContext : DbContext
{
    public ReadDbContext(
        DbContextOptions<ReadDbContext> options
    ) : base(options: options)
    {
        ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<ProductMeasurementView>(eb =>
        {
            eb.ToView("ProductMeasurements").HasKey(x => x.Id);
        });

        b.Entity<ProductPassportView>(eb =>
        {
            eb.ToView("ProductPassports").HasKey(x => x.Id);
        });

        b.Entity<ProductView>(eb =>
        {
            eb.ToView("Products").HasKey(x => x.Id);
        });
        
        b.Entity<MatchedPairDifferenceView>(eb =>
        {
            eb.ToView("MatchedPairDifferences").HasKey(x =>  new { MeasurementId1 = x.Measurement1Id, MeasurementId2 = x.Measurement2Id, x.ComparisonMode });
        });
    }

    public DbSet<ProductMeasurementView> ProductMeasurements { get; set; } = null!;

    public DbSet<ProductPassportView> Passports { get; set; } = null!;

    public DbSet<ProductView> Products { get; set; } = null!;

    public DbSet<MatchedPairDifferenceView> MatchedPairDifferences { get; set; } = null!;
}