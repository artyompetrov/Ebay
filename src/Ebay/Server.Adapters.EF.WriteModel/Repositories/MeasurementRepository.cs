using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Repositories;
using Server.Application.Data;
using Server.Domain.Measurements;

namespace Server.Adapters.EF.WriteModel.Repositories;

internal sealed class MeasurementRepository : IMeasurementRepository
{
    private readonly ApplicationDbContext _dbContext;

    public MeasurementRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProductMeasurement?> GetByIdAsync(string id, CancellationToken cancellationToken) => await _dbContext.ProductMeasurements.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task SaveAsync(ProductMeasurement aggregate, CancellationToken cancellationToken) => _ = await _dbContext.ProductMeasurements.AddAsync(aggregate, cancellationToken);

    public async Task RemoveAsync(string id, CancellationToken cancellationToken)
    {
        _ = await _dbContext.ProductMeasurements.Where(o => o.Id == id)
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
            _ = await _dbContext.ProductMeasurements
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}