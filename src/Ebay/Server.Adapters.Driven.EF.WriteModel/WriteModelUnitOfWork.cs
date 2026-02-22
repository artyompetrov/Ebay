using Server.Application.Abstractions.Driven.Abstractions.Abstractions;

namespace Server.Adapters.Driven.EF.WriteModel;

internal sealed class WriteModelUnitOfWork : IWriteModelUnitOfWork
{
    private readonly WriteModelDbContext _dbContext;

    public WriteModelUnitOfWork(WriteModelDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
