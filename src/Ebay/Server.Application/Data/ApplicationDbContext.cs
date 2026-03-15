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
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Domain;
using Server.Domain.Abstractions;
using Server.Domain.Measurements;
using Server.Domain.Product;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Server.Application.Data;

/// <summary>
/// Legacy монолитный DbContext. Он объединяет Identity, outbox/inbox, legacy доменные модели и инфраструктурные аспекты,
/// что нарушает границы портов и адаптеров. Новый write-model код и новые агрегаты нужно размещать в адаптере БД в едином
/// WriteModelDbContext и развивать его миграции в отдельной сборке миграций адаптера.
/// Класс оставлен только для совместимости со старым кодом и поэтапной миграции
/// </summary>
public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>, IUnitOfWork
{
    private readonly IWriteModelUnitOfWork? _writeModelUnitOfWork;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IOptions<OperationalStoreOptions> operationalStoreOptions,
        IWriteModelUnitOfWork? writeModelUnitOfWork = null)
        : base(options: options, operationalStoreOptions: operationalStoreOptions)
    {
        _writeModelUnitOfWork = writeModelUnitOfWork;
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        foreach (var et in builder.Model.GetEntityTypes()
                     .Where(t => typeof(IAggregateRoot).IsAssignableFrom(t.ClrType)))
        {
            builder.Entity(et.ClrType)
                .Property(nameof(IAggregateRoot.Version))
                .IsRowVersion()
                .ValueGeneratedOnAddOrUpdate();
        }

        builder.AddInboxStateEntity();
        builder.AddOutboxMessageEntity();
        builder.AddOutboxStateEntity();

        builder.Entity<Lot>()
            .Property(o => o.LotCalculationResult)
            .HasConversion(new ValueConverter<LotCalculationResult?, string>(
                v => JsonSerializer.Serialize(v!, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<LotCalculationResult?>(v, (JsonSerializerOptions?)null)
            ));

        builder.Entity<Product>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(e => e.Id)
                .ValueGeneratedNever();

            entity.Property(o => o.ProductCalculationResult)
                .HasConversion(new ValueConverter<ProductCalculationResult?, string>(
                    v => JsonSerializer.Serialize(v!, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<ProductCalculationResult?>(v, (JsonSerializerOptions?)null)
                ));

            entity.Navigation(p => p.SearchQueries)
                .UsePropertyAccessMode(PropertyAccessMode.Field);
            entity.Navigation(p => p.RuSearchQueries)
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            entity.OwnsMany(p => p.SearchQueries, q =>
            {
                q.WithOwner().HasForeignKey(nameof(SearchQuery.ProductId));
                q.HasKey(x => x.Id);
                q.Property(x => x.Id).ValueGeneratedNever();
                q.Property(x => x.Query).IsRequired();
                q.ToTable("Product_SearchQueries");
            });

            entity.OwnsMany(p => p.RuSearchQueries, q =>
            {
                q.WithOwner().HasForeignKey(nameof(SearchQuery.ProductId));
                q.HasKey(x => x.Id);
                q.Property(x => x.Id).ValueGeneratedNever();
                q.Property(x => x.Query).IsRequired();
                q.ToTable("Product_RuSearchQueries");
            });
        });

        builder.Entity<Purchase>()
            .Property(o => o.PurchaseCalculationResult)
            .HasConversion(new ValueConverter<PurchaseCalculationResult?, string>(
                v => JsonSerializer.Serialize(v!, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<PurchaseCalculationResult?>(v, (JsonSerializerOptions?)null)
            ));

        builder.Entity<ProductMeasurement>(entity =>
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
            entity.HasIndex(p => p.MatchId);
            entity.HasIndex(p => p.LotId);

            entity.HasIndex(x => x.HashAnodeCurves).IsUnique();
        });

        builder.Entity<ProductEmailSendHistory>(entity =>
        {
            entity.ToTable("SaleAdvertisements");
            entity.HasIndex(e => e.ProductId);
            entity.HasIndex(e => new { e.ProductId, e.Seller, e.Marketplace }).IsUnique();
            entity.HasIndex(e => e.CreatedAt);
            entity.Property(e => e.IsAmbiguous).HasDefaultValue(false);
        });

        builder.Entity<CacheEntry>(entity =>
        {
            entity.HasKey(e => new { e.Key, e.Version });
        });

        builder.Entity<ProductPassport>(entity =>
        {
            entity.HasIndex(e => new { e.ProductId, e.Order });
        });

        builder.Entity<TubeWorkingPoint>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne<Product>()
                .WithOne()
                .HasForeignKey<TubeWorkingPoint>(e => e.Id)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<IgnoredLot>(entity =>
        {
            entity.HasKey(e => new { e.ProductId, e.LotId });
        });

        builder.Entity<Purchase>(entity =>
        {
            entity.HasKey(e => new { e.LotId, e.Date });
        });

        builder.Entity<MatchedPairDifference>(entity =>
        {
            entity.Property(x => x.Id)
                .HasConversion(
                    v => JsonConvert.SerializeObject(v, Formatting.None),
                    v => JsonConvert.DeserializeObject<MatchedPairDifferenceId>(v)!);

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Measurement1Id)
                .HasMaxLength(100);

            entity.Property(e => e.Measurement2Id)
                .HasMaxLength(100);

            entity.HasIndex(x => x.Measurement1Id);
            entity.HasIndex(x => x.Measurement2Id);

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
        var changedRows = await base.SaveChangesAsync(cancellationToken);

        if (_writeModelUnitOfWork is not null && !ReferenceEquals(_writeModelUnitOfWork, this))
        {
            await _writeModelUnitOfWork.SaveChangesAsync(cancellationToken);
        }

        return changedRows;
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

        foreach (var aggregateEntry in aggregateEntries)
        {
            foreach (var domainEvent in aggregateEntry.Entity.GetDomainEvents())
            {
                await publishEndpoint.Publish((object)domainEvent /*без приведения к object не работает*/, cancellationToken);
            }

            aggregateEntry.Entity.ClearDomainEvents();
        }
    }

    private void ApplyAudit()
    {
        var now = DateTimeOffset.UtcNow;

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
