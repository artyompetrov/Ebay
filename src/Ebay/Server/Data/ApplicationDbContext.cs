using System.Text.Json;
using Duende.IdentityServer.EntityFramework.Options;
using MassTransit;
using Server.Data.Models;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Options;

namespace Server.Data;

internal class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
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

    public DbSet<Currency> Currencies { get; set; } = null!;
}