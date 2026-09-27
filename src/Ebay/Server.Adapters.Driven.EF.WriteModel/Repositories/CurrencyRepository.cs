using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class CurrencyRepository : ICurrencyRepository
{
    private readonly WriteModelDbContext _dbContext;

    public CurrencyRepository(WriteModelDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Currency?> GetByIdAsync(string id, CancellationToken cancellationToken) => await _dbContext.Currencies
        .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddAsync(Currency aggregate, CancellationToken cancellationToken) => _ = await _dbContext.Currencies.AddAsync(aggregate, cancellationToken);

    public async Task RemoveAsync(string id, CancellationToken cancellationToken)
    {
        await _dbContext.Currencies.Where(o => o.Id == id)
            .ExecuteDeleteAsync(cancellationToken: cancellationToken);
    }

    public async Task RemoveAsync(IReadOnlySet<string> ids, CancellationToken cancellationToken)
    {
        if (ids.Count == 0)
        {
            return;
        }

        const int batchSize = 1000; // безопасный размер IN (...)
        foreach (var batch in ids.Chunk(batchSize))
        {
            await _dbContext.Currencies
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}
