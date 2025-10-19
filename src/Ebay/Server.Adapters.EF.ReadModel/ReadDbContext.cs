using System.Text.Json;
using Client.Clients.Generated;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
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
            
            eb.HasOne(x => x.TubeWorkingPoint)
                .WithOne(x => x.Product)
                .HasForeignKey<TubeWorkingPointView>(tp => tp.Id)
                .HasPrincipalKey<ProductView>(p => p.Id);
            
            eb.Property(o => o.ProductCalculationResult)
                .HasConversion(new ValueConverter<ProductCalculationResult?, string>(
                    v => JsonSerializer.Serialize(v!, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<ProductCalculationResult?>(v, (JsonSerializerOptions?)null)
                ));
        });

        b.Entity<MatchedPairDifferenceView>(eb =>
        {
            eb.ToView("MatchedPairDifferences").HasKey(x => new { MeasurementId1 = x.Measurement1Id, MeasurementId2 = x.Measurement2Id, x.ComparisonMode });
        });

        b.Entity<TubeWorkingPointView>(x =>
        {
            x.ToView("TubeWorkingPoints").HasKey(x => x.Id);
        });
        
        b.Entity<SearchQueryView>(x =>
        {
            x.ToView("Product_SearchQueries").HasKey(x => x.Id);
        });
    }

    public DbSet<ProductMeasurementView> ProductMeasurements { get; set; } = null!;

    public DbSet<ProductPassportView> Passports { get; set; } = null!;

    public DbSet<ProductView> Products { get; set; } = null!;

    public DbSet<MatchedPairDifferenceView> MatchedPairDifferences { get; set; } = null!;
    
    public DbSet<TubeWorkingPointView> TubeWorkingPoints { get; set; } = null!;
}