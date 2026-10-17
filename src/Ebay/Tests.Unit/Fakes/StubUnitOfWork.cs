using System.Data;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Tests.Unit.Fakes;

/// <summary>
/// Фейк Unit of Work для сценариев, которым не нужны транзакции: считает сохранения и освобождения.
/// </summary>
internal sealed class StubUnitOfWork : IWriteModelUnitOfWork
{
    public int SaveChangesCallCount { get; private set; }

    public int DisposeCallCount { get; private set; }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        SaveChangesCallCount++;
        return Task.FromResult(0);
    }

    public Task<IUnitOfWorkTransaction> BeginTransactionAsync(
        CancellationToken cancellationToken,
        IsolationLevel isolationLevel = IsolationLevel.ReadCommitted) =>
        throw new NotSupportedException();

    public ValueTask DisposeAsync()
    {
        DisposeCallCount++;
        return ValueTask.CompletedTask;
    }
}
