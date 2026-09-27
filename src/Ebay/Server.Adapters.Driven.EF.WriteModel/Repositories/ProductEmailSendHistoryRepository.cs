using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class ProductEmailSendHistoryRepository : IProductEmailSendHistoryRepository
{
    private readonly WriteModelDbContext _dbContext;

    public ProductEmailSendHistoryRepository(WriteModelDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProductEmailSendHistory?> GetByIdAsync(Guid id, CancellationToken cancellationToken) => await _dbContext.ProductEmailSendHistories
        .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddAsync(ProductEmailSendHistory aggregate, CancellationToken cancellationToken) => _ = await _dbContext.ProductEmailSendHistories.AddAsync(aggregate, cancellationToken);

    public async Task RemoveAsync(Guid id, CancellationToken cancellationToken)
    {
        await _dbContext.ProductEmailSendHistories.Where(o => o.Id == id)
            .ExecuteDeleteAsync(cancellationToken: cancellationToken);
    }

    public async Task RemoveAsync(IReadOnlySet<Guid> ids, CancellationToken cancellationToken)
    {
        if (ids.Count == 0)
        {
            return;
        }

        const int batchSize = 1000; // безопасный размер IN (...)
        foreach (var batch in ids.Chunk(batchSize))
        {
            await _dbContext.ProductEmailSendHistories
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }

    public async Task RemoveOlderThanAsync(DateTimeOffset threshold, CancellationToken cancellationToken)
    {
        await _dbContext.ProductEmailSendHistories
            .Where(x => x.AdvertisementDate < threshold)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
