using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Repositories;
using Server.Application.Data;
using Server.Domain;

namespace Server.Adapters.EF.WriteModel.Repositories;

internal sealed class ProductRepository(ApplicationDbContext dbContext) : IProductRepository
{
    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        await using var transaction = await TransactionHelper.EnsureRepeatableReadOrStartAsync(dbContext, cancellationToken);

        var result = await dbContext.Products
            .AsSplitQuery()
            .Include(x => x.RuSearchQueries)
            .Include(x => x.SearchQueries)
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

        await transaction.CommitIfOwnedAsync(cancellationToken);

        return result;
    }

    public async Task SaveAsync(Product aggregate, CancellationToken cancellationToken) => _ = await dbContext.Products.AddAsync(aggregate, cancellationToken);

    public async Task RemoveAsync(Guid id, CancellationToken cancellationToken)
    {
        _ = await dbContext.Products.Where(o => o.Id == id)
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
            _ = await dbContext.Products
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}