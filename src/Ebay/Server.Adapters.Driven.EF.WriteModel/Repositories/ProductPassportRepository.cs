using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class ProductPassportRepository : IProductPassportRepository
{
    private readonly WriteModelDbContext _dbContext;

    public ProductPassportRepository(WriteModelDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProductPassport?> GetByIdAsync(Guid id, CancellationToken cancellationToken) => await _dbContext.ProductPassports
        .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddAsync(ProductPassport aggregate, CancellationToken cancellationToken) => _ = await _dbContext.ProductPassports.AddAsync(aggregate, cancellationToken);

    public async Task RemoveAsync(Guid id, CancellationToken cancellationToken)
    {
        await _dbContext.ProductPassports.Where(o => o.Id == id)
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
            await _dbContext.ProductPassports
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}
