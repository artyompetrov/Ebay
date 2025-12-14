using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Server.Adapters.EF.ReadModel.ReadModelSchema;
using Server.Domain;

namespace Server.Adapters.EF.ReadModel;

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
        _ = b.Entity<ProductMeasurementView>(eb =>
        {
            _ = eb.ToView("ProductMeasurements").HasKey(x => x.Id);
        });

        _ = b.Entity<ProductPassportView>(eb =>
        {
            _ = eb.ToView("ProductPassports").HasKey(x => x.Id);
        });

        _ = b.Entity<ProductView>(eb =>
        {
            _ = eb.ToView("Products").HasKey(x => x.Id);

            _ = eb.HasOne(x => x.TubeWorkingPoint)
                .WithOne(x => x.Product)
                .HasForeignKey<TubeWorkingPointView>(tp => tp.Id)
                .HasPrincipalKey<ProductView>(p => p.Id);

            _ = eb.OwnsMany(p => p.SearchQueries, q =>
            {
                _ = q.WithOwner().HasForeignKey(nameof(SearchQuery.ProductId));
                _ = q.HasKey(x => x.Id);
                _ = q.ToTable("Product_SearchQueries");
            });

            _ = eb.OwnsMany(p => p.RuSearchQueries, q =>
            {
                _ = q.WithOwner().HasForeignKey(nameof(SearchQuery.ProductId));
                _ = q.HasKey(x => x.Id);
                _ = q.ToTable("Product_RuSearchQueries");
            });

            _ = eb.Property(o => o.ProductCalculationResult)
                .HasConversion(new ValueConverter<ProductCalculationResult?, string>(
                    v => JsonSerializer.Serialize(v!, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<ProductCalculationResult?>(v, (JsonSerializerOptions?)null)
                ));
        });

        _ = b.Entity<MatchedPairDifferenceView>(eb =>
        {
            _ = eb.ToView("MatchedPairDifferences").HasKey(x => new { MeasurementId1 = x.Measurement1Id, MeasurementId2 = x.Measurement2Id, x.ComparisonMode });
        });

        _ = b.Entity<TubeWorkingPointView>(x =>
        {
            _ = x.ToView("TubeWorkingPoints").HasKey(x => x.Id);
        });
    }

    public DbSet<ProductMeasurementView> ProductMeasurements { get; set; } = null!;

    public DbSet<ProductPassportView> Passports { get; set; } = null!;

    public DbSet<ProductView> Products { get; set; } = null!;

    public DbSet<MatchedPairDifferenceView> MatchedPairDifferences { get; set; } = null!;

    public DbSet<TubeWorkingPointView> TubeWorkingPoints { get; set; } = null!;
}