using System.Text.Json;
using Duende.IdentityServer.EntityFramework.Options;
using MassTransit;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Options;
using Server.Application.Data.Models;

namespace Server.Application.Data;

public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.AddInboxStateEntity();
        modelBuilder.AddOutboxMessageEntity();
        modelBuilder.AddOutboxStateEntity();

        modelBuilder.Entity<Lot>()
            .Property(o => o.LotCalculationResult)
            .HasConversion(new ValueConverter<LotCalculationResult?, string>(
                v => JsonSerializer.Serialize(v!, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<LotCalculationResult?>(v, (JsonSerializerOptions?)null)
            ));

        modelBuilder.Entity<Product>()
            .Property(o => o.ProductCalculationResult)
            .HasConversion(new ValueConverter<ProductCalculationResult?, string>(
                v => JsonSerializer.Serialize(v!, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<ProductCalculationResult?>(v, (JsonSerializerOptions?)null)
            ));

        modelBuilder.Entity<Purchase>()
            .Property(o => o.PurchaseCalculationResult)
            .HasConversion(new ValueConverter<PurchaseCalculationResult?, string>(
                v => JsonSerializer.Serialize(v!, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<PurchaseCalculationResult?>(v, (JsonSerializerOptions?)null)
            ));

        modelBuilder.Entity<ProductMeasurement>(entity =>
        {
            entity.HasIndex(e => e.HashAnodeCurves).IsUnique();
            entity.HasIndex(e => e.HashQuickTest).IsUnique();
            entity.HasIndex(e => e.HashGridCurves).IsUnique();
        });

        modelBuilder.Entity<ProductEmailSendHistory>(entity =>
        {
            entity.ToTable("SaleAdvertisements");
            entity.HasIndex(e => e.ProductId);
            entity.HasIndex(e => new { e.ProductId, e.Seller, e.Marketplace }).IsUnique();
            entity.HasIndex(e => e.CreatedAt);
            entity.Property(e => e.IsAmbiguous).HasDefaultValue(false);
        });

        modelBuilder.Entity<CacheEntry>(entity =>
        {
            entity.HasKey(e => new { e.Key, e.Version });
        });

        modelBuilder.Entity<ProductMeasurement>()
            .Property(p => p.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        modelBuilder.Entity<ProductMeasurement>()
            .HasIndex(p => p.CreatedAt);

        modelBuilder.Entity<ProductPassport>(entity =>
        {
            entity.HasIndex(e => new { e.ProductId, e.Order });
        });
    }

    public ApplicationDbContext(
        DbContextOptions options,
        IOptions<OperationalStoreOptions> operationalStoreOptions
    ) : base(options: options, operationalStoreOptions: operationalStoreOptions)
    {
    }

    public DbSet<Product> Products { get; set; } = null!;

    public DbSet<SearchQuery> SearchQueries { get; set; } = null!;

    public DbSet<RuSearchQuery> RuSearchQueries { get; set; } = null!;

    public DbSet<Lot> Lots { get; set; } = null!;

    public DbSet<IgnoredLot> IgnoredLots { get; set; } = null!;

    public DbSet<Purchase> Purchases { get; set; } = null!;

    public DbSet<ClientError> ClientErrors { get; set; } = null!;

    public DbSet<ProductMeasurement> ProductMeasurements { get; set; } = null!;

    public DbSet<ProductPassport> ProductPassports { get; set; } = null!;

    public DbSet<Currency> Currencies { get; set; } = null!;

    public DbSet<ProductEmailSendHistory> ProductEmailSendHistory { get; set; } = null!;

    public DbSet<CacheEntry> CacheEntries { get; set; } = null!;
}