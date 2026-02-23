using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Newtonsoft.Json;
using Server.Application.Abstractions.Driven.Abstractions.Abstractions;
using Server.Domain;
using Server.Domain.Abstractions;
using Server.Domain.LotForSale;
using Server.Domain.Measurements;
using Server.Domain.Product;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Server.Adapters.Driven.EF.WriteModel;

public sealed class WriteModelDbContext : DbContext, IWriteModelUnitOfWork
{
    public WriteModelDbContext(DbContextOptions<WriteModelDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        _ = modelBuilder.HasDefaultSchema("wm");

        foreach (var entityType in modelBuilder.Model.GetEntityTypes()
                     .Where(t => typeof(IAggregateRoot).IsAssignableFrom(t.ClrType)))
        {
            _ = modelBuilder.Entity(entityType.ClrType)
                .Property(nameof(IAggregateRoot.Version))
                .IsRowVersion()
                .ValueGeneratedOnAddOrUpdate();
        }

        _ = modelBuilder.Entity<Product>(entity =>
        {
            _ = entity.HasKey(x => x.Id);

            _ = entity.Property(e => e.Id)
                .ValueGeneratedNever();

            _ = entity.Property(o => o.ProductCalculationResult)
                .HasConversion(new ValueConverter<ProductCalculationResult?, string>(
                    v => JsonSerializer.Serialize(v!, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<ProductCalculationResult?>(v, (JsonSerializerOptions?)null)
                ));

            _ = entity.Navigation(p => p.SearchQueries)
                .UsePropertyAccessMode(PropertyAccessMode.Field);
            _ = entity.Navigation(p => p.RuSearchQueries)
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            _ = entity.OwnsMany(p => p.SearchQueries, q =>
            {
                _ = q.WithOwner().HasForeignKey(nameof(SearchQuery.ProductId));
                _ = q.HasKey(x => x.Id);
                _ = q.Property(x => x.Id).ValueGeneratedNever();
                _ = q.Property(x => x.Query).IsRequired();
                _ = q.ToTable("Product_SearchQueries");
            });

            _ = entity.OwnsMany(p => p.RuSearchQueries, q =>
            {
                _ = q.WithOwner().HasForeignKey(nameof(SearchQuery.ProductId));
                _ = q.HasKey(x => x.Id);
                _ = q.Property(x => x.Id).ValueGeneratedNever();
                _ = q.Property(x => x.Query).IsRequired();
                _ = q.ToTable("Product_RuSearchQueries");
            });
        });

        _ = modelBuilder.Entity<ProductMeasurement>(entity =>
        {
            _ = entity.HasKey(x => x.Id);

            _ = entity.Property(x => x.Id)
                .HasMaxLength(100)
                .ValueGeneratedNever();

            _ = entity.Property(p => p.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            _ = entity.Property(x => x.ProductId).IsRequired();

            _ = entity.HasOne<Product>()
                .WithMany()
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            _ = entity.HasIndex(x => x.ProductId);
            _ = entity.HasIndex(p => p.CreatedAt);
            _ = entity.HasIndex(p => p.MatchId);
            _ = entity.HasIndex(p => p.LotId);

            _ = entity.HasIndex(x => x.HashAnodeCurves).IsUnique();
        });

        _ = modelBuilder.Entity<MatchedPairDifference>(entity =>
        {
            _ = entity.Property(x => x.Id)
                .HasConversion(
                    v => JsonConvert.SerializeObject(v, Formatting.None),
                    v => JsonConvert.DeserializeObject<MatchedPairDifferenceId>(v)!);

            _ = entity.HasKey(e => e.Id);

            _ = entity.Property(e => e.Measurement1Id)
                .HasMaxLength(100);

            _ = entity.Property(e => e.Measurement2Id)
                .HasMaxLength(100);

            _ = entity.HasIndex(x => x.Measurement1Id);
            _ = entity.HasIndex(x => x.Measurement2Id);

            _ = entity.HasOne<ProductMeasurement>()
                .WithMany()
                .HasForeignKey(e => e.Measurement1Id)
                .OnDelete(DeleteBehavior.Restrict);

            _ = entity.HasOne<ProductMeasurement>()
                .WithMany()
                .HasForeignKey(e => e.Measurement2Id)
                .OnDelete(DeleteBehavior.Restrict);
        });

        _ = modelBuilder.Entity<LotForSale>(entity =>
        {
            _ = entity.HasKey(x => x.Id);

            _ = entity.Property(x => x.Id)
                .HasMaxLength(7)
                .ValueGeneratedNever();

            _ = entity.Property(x => x.Name)
                .IsRequired();

            _ = entity.Property(x => x.ProductId)
                .IsRequired();
        });
    }

    public DbSet<Product> Products { get; set; } = null!;

    public DbSet<ProductMeasurement> ProductMeasurements { get; set; } = null!;

    public DbSet<MatchedPairDifference> MatchedPairDifferences { get; set; } = null!;

    public DbSet<LotForSale> LotForSales { get; set; } = null!;
}
