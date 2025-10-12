using System.Data;
using System.Text.Json;
using Duende.IdentityServer.EntityFramework.Options;
using MassTransit;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Options;
using Server.Application.Abstractions;
using Server.Domain;
using Server.Domain.Measurements;

namespace Server.Application.Data;

public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>, IUnitOfWork
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IOptions<OperationalStoreOptions> operationalStoreOptions
    ) : base(options: options, operationalStoreOptions: operationalStoreOptions)
    {

    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        foreach (var et in modelBuilder.Model.GetEntityTypes()
                     .Where(t => typeof(IAggregateRoot).IsAssignableFrom(t.ClrType)))
        {
            modelBuilder.Entity(et.ClrType)
                .Property(nameof(IAggregateRoot.Version))
                .IsRowVersion()
                .ValueGeneratedOnAddOrUpdate();
        }

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
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasMaxLength(100)
                .ValueGeneratedNever();

            entity.Property(p => p.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(x => x.ProductId).IsRequired();

            entity.HasOne<Product>()
                .WithMany()
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            entity.HasIndex(x => x.ProductId);
            entity.HasIndex(p => p.CreatedAt);

            entity.HasIndex(x => x.HashAnodeCurves).IsUnique();
            entity.HasIndex(x => x.HashQuickTest).IsUnique();
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


        modelBuilder.Entity<ProductPassport>(entity =>
        {
            entity.HasIndex(e => new { e.ProductId, e.Order });
        });

        modelBuilder.Entity<TubeWorkingPoint>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne<Product>()
                .WithOne(e => e.TubeWorkingPoint)
                .HasForeignKey<TubeWorkingPoint>(e => e.Id)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<IgnoredLot>(entity =>
        {
            entity.HasKey(e => new { e.ProductId, e.LotId });
        });


        modelBuilder.Entity<Purchase>(entity =>
        {
            entity.HasKey(e => new { e.LotId, e.Date });
        });

        modelBuilder.Entity<MatchedPairDifference>(entity =>
        {
            entity.HasKey(e => new { MeasurementId1 = e.Measurement1Id, MeasurementId2 = e.Measurement2Id, e.ComparisonMode });

            entity.Property(e => e.Measurement1Id)
                .HasMaxLength(100);

            entity.Property(e => e.Measurement2Id)
                .HasMaxLength(100);

            entity.HasOne<ProductMeasurement>()
                .WithMany()
                .HasForeignKey(e => e.Measurement1Id)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<ProductMeasurement>()
                .WithMany()
                .HasForeignKey(e => e.Measurement2Id)
                .OnDelete(DeleteBehavior.Restrict);
        });
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

    public DbSet<TubeWorkingPoint> TubeWorkingPoints { get; set; } = null!;

    public DbSet<MatchedPairDifference> MatchedPairDifferences { get; set; } = null!;


    public async Task<IUnitOfWorkTransaction> BeginTransactionAsync(
        CancellationToken cancellationToken,
        IsolationLevel isolationLevel = IsolationLevel.ReadCommitted)
    {
        return new ApplicationDbContextTransaction(await Database.BeginTransactionAsync(isolationLevel: isolationLevel, cancellationToken));
    }

    private class ApplicationDbContextTransaction : IUnitOfWorkTransaction
    {
        private readonly IDbContextTransaction _transaction;

        public ApplicationDbContextTransaction(IDbContextTransaction transaction)
        {
            _transaction = transaction;
        }

        public async ValueTask DisposeAsync()
        {
            await _transaction.DisposeAsync();
        }

        public Task CommitAsync(CancellationToken cancellationToken) => _transaction.CommitAsync(cancellationToken);

        public void Dispose()
        {
            _transaction.Dispose();
        }
    }
}