using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class ProductEmailSendHistoryRepository : IProductEmailSendHistoryRepository
{
    public async Task<ProductEmailSendHistory?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, Guid id, CancellationToken cancellationToken) => await WriteModelUnitOfWork.From(unitOfWork).DbContext.ProductEmailSendHistories
        .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddAsync(IWriteModelUnitOfWork unitOfWork, ProductEmailSendHistory aggregate, CancellationToken cancellationToken) => _ = await WriteModelUnitOfWork.From(unitOfWork).DbContext.ProductEmailSendHistories.AddAsync(aggregate, cancellationToken);

    public async Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, Guid id, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        await dbContext.ProductEmailSendHistories.Where(o => o.Id == id)
            .ExecuteDeleteAsync(cancellationToken: cancellationToken);
    }

    public async Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<Guid> ids, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        if (ids.Count == 0)
        {
            return;
        }

        const int batchSize = 1000; // безопасный размер IN (...)
        foreach (var batch in ids.Chunk(batchSize))
        {
            await dbContext.ProductEmailSendHistories
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }

    public async Task RemoveOlderThanAsync(IWriteModelUnitOfWork unitOfWork, DateTimeOffset threshold, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        await dbContext.ProductEmailSendHistories
            .Where(x => x.AdvertisementDate < threshold)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
