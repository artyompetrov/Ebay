using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain.Product;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class ProductRepository : IProductRepository
{
    public async Task<Product?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, Guid id, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        await using var transaction = await TransactionHelper.EnsureRepeatableReadOrStartAsync(dbContext, cancellationToken);

        var result = await dbContext.Products
            .AsSplitQuery()
            .Include(x => x.RuSearchQueries)
            .Include(x => x.SearchQueries)
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

        await transaction.CommitIfOwnedAsync(cancellationToken);

        return result;
    }

    public async Task AddAsync(IWriteModelUnitOfWork unitOfWork, Product aggregate, CancellationToken cancellationToken) => _ = await WriteModelUnitOfWork.From(unitOfWork).DbContext.Products.AddAsync(aggregate, cancellationToken);

    public async Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, Guid id, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        await dbContext.Products.Where(o => o.Id == id)
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
            await dbContext.Products
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}