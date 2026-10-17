using System.Data;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.EF.WriteModel;

/// <summary>
/// One write operation: owns a DI scope with its own <see cref="WriteModelDbContext"/> and the MassTransit
/// bus-outbox <see cref="IPublishEndpoint"/> bound to that same context, so aggregate changes, domain events and
/// published messages are committed by a single <see cref="SaveChangesAsync"/>.
/// </summary>
/// <remarks>
/// The DI scope is required by MassTransit: its EF bus outbox resolves the scoped <see cref="WriteModelDbContext"/>
/// (registered by <c>AddPooledDbContextFactory</c>) from the same scope as the scoped <see cref="IPublishEndpoint"/>.
/// The scope is an implementation detail of this adapter; callers only see <see cref="IWriteModelUnitOfWork"/>.
/// </remarks>
internal sealed class WriteModelUnitOfWork : IWriteModelUnitOfWork
{
    private readonly AsyncServiceScope _scope;

    public WriteModelUnitOfWork(AsyncServiceScope scope)
    {
        _scope = scope;
        DbContext = scope.ServiceProvider.GetRequiredService<WriteModelDbContext>();
        PublishEndpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();
    }

    public WriteModelDbContext DbContext { get; }

    public IPublishEndpoint PublishEndpoint { get; }

    /// <summary>
    /// Returns the EF unit of work behind a port instance created by <see cref="WriteModelUnitOfWorkFactory"/>.
    /// </summary>
    public static WriteModelUnitOfWork From(IWriteModelUnitOfWork unitOfWork) =>
        unitOfWork as WriteModelUnitOfWork ?? throw new ArgumentException(
            $"Unit of work must be created by {nameof(IWriteModelUnitOfWorkFactory)} of the EF write-model adapter, got {unitOfWork.GetType()}.",
            nameof(unitOfWork));

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        foreach (var aggregate in DbContext.GetAggregatesWithEvents())
        {
            foreach (var domainEvent in aggregate.GetDomainEvents())
            {
                await PublishEndpoint.Publish((object)domainEvent, cancellationToken);
            }

            aggregate.ClearDomainEvents();
        }

        return await DbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IUnitOfWorkTransaction> BeginTransactionAsync(
        CancellationToken cancellationToken,
        IsolationLevel isolationLevel = IsolationLevel.ReadCommitted) =>
        new Transaction(await DbContext.Database.BeginTransactionAsync(isolationLevel: isolationLevel, cancellationToken));

    public ValueTask DisposeAsync() => _scope.DisposeAsync();

    private sealed class Transaction : IUnitOfWorkTransaction
    {
        private readonly IDbContextTransaction _transaction;

        public Transaction(IDbContextTransaction transaction)
        {
            _transaction = transaction;
        }

        public async ValueTask DisposeAsync() => await _transaction.DisposeAsync();

        public Task CommitAsync(CancellationToken cancellationToken) => _transaction.CommitAsync(cancellationToken);

        public void Dispose() => _transaction.Dispose();
    }
}
