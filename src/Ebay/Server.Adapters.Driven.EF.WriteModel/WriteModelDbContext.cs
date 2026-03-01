using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Domain.Abstractions;
using Server.Domain.LotForSale;

namespace Server.Adapters.Driven.EF.WriteModel;

public sealed class WriteModelDbContext : DbContext, IWriteModelUnitOfWork
{
    public WriteModelDbContext(DbContextOptions<WriteModelDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema("wm");
        modelBuilder.AddInboxStateEntity();
        modelBuilder.AddOutboxMessageEntity();
        modelBuilder.AddOutboxStateEntity();

        foreach (var entityType in modelBuilder.Model.GetEntityTypes()
                     .Where(t => typeof(IAggregateRoot).IsAssignableFrom(t.ClrType)))
        {
            modelBuilder.Entity(entityType.ClrType)
                .Property(nameof(IAggregateRoot.Version))
                .IsRowVersion()
                .ValueGeneratedOnAddOrUpdate();
        }

        modelBuilder.Entity<LotForSale>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasMaxLength(7)
                .ValueGeneratedNever();

            entity.Property(x => x.Name)
                .IsRequired();

            entity.Property(x => x.ProductId)
                .IsRequired();

            entity.Property(x => x.ProductState)
                .HasConversion<string>()
                .IsRequired();
        });
    }

    public DbSet<LotForSale> LotForSales { get; set; } = null!;

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyAudit();
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

        foreach (var domainEvent in aggregateEntries.SelectMany(entry => entry.Entity.GetDomainEvents()))
        {
            await publishEndpoint.Publish((object)domainEvent, cancellationToken);
        }
    }

    /// <summary>
    /// Добавляем метки времени изменеиния для сущностей
    /// </summary>
    private void ApplyAudit()
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<IAuditable>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.ChangedAt = now;
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Entity.ChangedAt = now;
                entry.Property(x => x.CreatedAt).IsModified = false;
            }
        }
    }
}
