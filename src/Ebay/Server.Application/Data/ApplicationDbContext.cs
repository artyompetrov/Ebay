using System.Data;
using System.Text.Json;
using Duende.IdentityServer.EntityFramework.Options;
using MassTransit;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Server.Application.Abstractions.Driven.Abstractions.Abstractions;
using Server.Domain;
using Server.Domain.Abstractions;
using Server.Domain.Measurements;
using Server.Domain.Product;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Server.Application.Data;

public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>, IUnitOfWork
{
    
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IOptions<OperationalStoreOptions> operationalStoreOptions)
        : base(options: options, operationalStoreOptions: operationalStoreOptions)
    {
    }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);


        foreach (var et in builder.Model.GetEntityTypes()
                     .Where(t => typeof(IAggregateRoot).IsAssignableFrom(t.ClrType)))
        {
            _ = builder.Entity(et.ClrType)
                .Property(nameof(IAggregateRoot.Version))
                .IsRowVersion()
                .ValueGeneratedOnAddOrUpdate();
        }

        builder.AddInboxStateEntity();
        builder.AddOutboxMessageEntity();
        builder.AddOutboxStateEntity();

        _ = builder.Entity<Lot>()
            .Property(o => o.LotCalculationResult)
            .HasConversion(new ValueConverter<LotCalculationResult?, string>(
                v => JsonSerializer.Serialize(v!, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<LotCalculationResult?>(v, (JsonSerializerOptions?)null)
            ));

        _ = builder.Entity<Product>(entity =>
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

        _ = builder.Entity<Purchase>()
            .Property(o => o.PurchaseCalculationResult)
            .HasConversion(new ValueConverter<PurchaseCalculationResult?, string>(
                v => JsonSerializer.Serialize(v!, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<PurchaseCalculationResult?>(v, (JsonSerializerOptions?)null)
            ));

        _ = builder.Entity<ProductMeasurement>(entity =>
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

        _ = builder.Entity<ProductEmailSendHistory>(entity =>
        {
            _ = entity.ToTable("SaleAdvertisements");
            _ = entity.HasIndex(e => e.ProductId);
            _ = entity.HasIndex(e => new { e.ProductId, e.Seller, e.Marketplace }).IsUnique();
            _ = entity.HasIndex(e => e.CreatedAt);
            _ = entity.Property(e => e.IsAmbiguous).HasDefaultValue(false);
        });

        _ = builder.Entity<CacheEntry>(entity =>
        {
            _ = entity.HasKey(e => new { e.Key, e.Version });
        });


        _ = builder.Entity<ProductPassport>(entity =>
        {
            _ = entity.HasIndex(e => new { e.ProductId, e.Order });
        });

        _ = builder.Entity<TubeWorkingPoint>(entity =>
        {
            _ = entity.HasKey(e => e.Id);
            _ = entity.HasOne<Product>()
                .WithOne()
                .HasForeignKey<TubeWorkingPoint>(e => e.Id)
                .OnDelete(DeleteBehavior.Restrict);
        });

        _ = builder.Entity<IgnoredLot>(entity =>
        {
            _ = entity.HasKey(e => new { e.ProductId, e.LotId });
        });


        _ = builder.Entity<Purchase>(entity =>
        {
            _ = entity.HasKey(e => new { e.LotId, e.Date });
        });

        _ = builder.Entity<MatchedPairDifference>(entity =>
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
    }



    public DbSet<Product> Products { get; set; } = null!;

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
        IsolationLevel isolationLevel = IsolationLevel.ReadCommitted) => new ApplicationDbContextTransaction(await Database.BeginTransactionAsync(isolationLevel: isolationLevel, cancellationToken));

    private class ApplicationDbContextTransaction : IUnitOfWorkTransaction
    {
        private readonly IDbContextTransaction _transaction;

        public ApplicationDbContextTransaction(IDbContextTransaction transaction)
        {
            _transaction = transaction;
        }

        public async ValueTask DisposeAsync() => await _transaction.DisposeAsync();

        public Task CommitAsync(CancellationToken cancellationToken) => _transaction.CommitAsync(cancellationToken);

        public void Dispose() => _transaction.Dispose();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyAudit();
        // Publish before EF save so MT bus outbox stores messages in the same transaction.
        await PublishDomainEventsAsync(cancellationToken);
        return await base.SaveChangesAsync(cancellationToken);
    }

    private async Task PublishDomainEventsAsync(CancellationToken cancellationToken)
    {
        var aggregateEntries = ChangeTracker.Entries<IAggregateRoot>()
            .Where(entry => entry.State != EntityState.Detached && entry.Entity.HasEvents)
            .ToList();

        if (aggregateEntries.Count == 0)
        {
            return;
        }

        var publishEndpoint = this.GetService<IPublishEndpoint>();
        var domainEvents = aggregateEntries
            .SelectMany(entry => entry.Entity.GetDomainEvents())
            .ToArray();

        foreach (var domainEvent in domainEvents)
        {
            await publishEndpoint.Publish(domainEvent, cancellationToken);
        }

        foreach (var aggregateEntry in aggregateEntries)
        {
            aggregateEntry.Entity.ClearDomainEvents();
        }
    }

    private void ApplyAudit()
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<IAuditable>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = now;
                    entry.Entity.ChangedAt = now;
                    break;

                case EntityState.Modified:
                    entry.Entity.ChangedAt = now;

                    // защита от случайного апдейта CreatedAt
                    entry.Property(x => x.CreatedAt).IsModified = false;
                    break;
                case EntityState.Detached:
                    break;
                case EntityState.Unchanged:
                    break;
                case EntityState.Deleted:
                    break;
                default:
                    break;
            }
        }
    }
}
