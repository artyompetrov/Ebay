using System.Data;
using Duende.IdentityServer.EntityFramework.Options;
using MassTransit;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Domain;
using Server.Domain.Abstractions;
using Server.Domain.Product;

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

        // Все доменные агрегаты теперь принадлежат WriteModelDbContext (см. Server.Adapters.Driven.EF.WriteModel).
        // Явные Ignore нужны, иначе они попали бы в модель этого контекста через конвенцию (например, через
        // ApplicationUser или прежние cross-aggregate навигации) и конфликтовали бы с wm-схемой. Purchase
        // владеется Lot (owned collection), поэтому отдельного Ignore не требует.
        builder.Ignore<Product>();
        builder.Ignore<Lot>();
        builder.Ignore<Currency>();
        builder.Ignore<ProductEmailSendHistory>();
        builder.Ignore<ProductPassport>();
        builder.Ignore<IgnoredLot>();
        builder.Ignore<ClientError>();
    }

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