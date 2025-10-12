using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions;
using Server.Application.Data;
using Server.Domain.Measurements;

namespace Server.Adapters.EF.WriteModel;

internal class MeasurementRepository : IRepository<ProductMeasurement, string>
{
    private readonly ApplicationDbContext _dbContext;

    public MeasurementRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProductMeasurement?> GetByIdAsync(string id, CancellationToken cancellationToken)
    {
        return await _dbContext.ProductMeasurements.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task SaveAsync(ProductMeasurement aggregate, CancellationToken cancellationToken)
    {
        await _dbContext.ProductMeasurements.AddAsync(aggregate, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveAsync(string id, CancellationToken cancellationToken)
    {
        await _dbContext.ProductMeasurements.Where(o => o.Id == id)
            .ExecuteDeleteAsync(cancellationToken: cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}