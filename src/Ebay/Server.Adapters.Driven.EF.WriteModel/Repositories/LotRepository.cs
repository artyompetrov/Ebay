using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class LotRepository : ILotRepository
{
    public async Task<Lot?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, long id, CancellationToken cancellationToken) => await WriteModelUnitOfWork.From(unitOfWork).DbContext.Lots
        .Include(x => x.Purchases)
        .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddAsync(IWriteModelUnitOfWork unitOfWork, Lot aggregate, CancellationToken cancellationToken) => _ = await WriteModelUnitOfWork.From(unitOfWork).DbContext.Lots.AddAsync(aggregate, cancellationToken);

    public async Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, long id, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        await dbContext.Lots.Where(o => o.Id == id)
            .ExecuteDeleteAsync(cancellationToken: cancellationToken);
    }

    public async Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<long> ids, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        if (ids.Count == 0)
        {
            return;
        }

        const int batchSize = 1000; // безопасный размер IN (...)
        foreach (var batch in ids.Chunk(batchSize))
        {
            await dbContext.Lots
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}
